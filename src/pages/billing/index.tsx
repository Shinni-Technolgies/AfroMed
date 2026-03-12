import { useState, useMemo } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import {
  useGetInvoices,
  useGetPayments,
  useGetBillingStats,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  createPayment
} from 'api/billing';

// types
import {
  Invoice,
  InvoiceStatus,
  InvoiceItem,
  PaymentMethod,
  Payment
} from 'types/models';

// assets
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

// ==============================|| CONSTANTS ||============================== //

const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'issued', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'];
const ITEM_TYPES = ['consultation', 'procedure', 'medication', 'lab_test', 'room_charge', 'other'] as const;
const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'bank_transfer', 'mobile_money', 'insurance', 'other'];

// ==============================|| HELPERS ||============================== //

function InvoiceStatusChip({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { color: 'default' | 'info' | 'primary' | 'success' | 'warning' | 'error'; label: string }> = {
    draft: { color: 'default', label: 'Draft' },
    issued: { color: 'info', label: 'Issued' },
    paid: { color: 'success', label: 'Paid' },
    partially_paid: { color: 'primary', label: 'Partially Paid' },
    overdue: { color: 'error', label: 'Overdue' },
    cancelled: { color: 'default', label: 'Cancelled' },
    refunded: { color: 'warning', label: 'Refunded' }
  };
  const { color, label } = map[status] ?? { color: 'default' as const, label: status };
  return <Chip size="small" color={color} label={label} />;
}

function PaymentStatusChip({ status }: { status: string }) {
  const map: Record<string, { color: 'default' | 'success' | 'warning' | 'error'; label: string }> = {
    completed: { color: 'success', label: 'Completed' },
    pending: { color: 'warning', label: 'Pending' },
    failed: { color: 'error', label: 'Failed' },
    refunded: { color: 'default', label: 'Refunded' }
  };
  const { color, label } = map[status] ?? { color: 'default' as const, label: status };
  return <Chip size="small" color={color} label={label} />;
}

function formatCurrency(amount: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatMethodLabel(method: string) {
  return method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ==============================|| HEAD CELLS ||============================== //

const invoiceHeadCells = [
  { id: 'invoiceNumber', align: 'left' as const, label: 'Invoice #' },
  { id: 'patientName', align: 'left' as const, label: 'Patient' },
  { id: 'totalAmount', align: 'right' as const, label: 'Total' },
  { id: 'amountPaid', align: 'right' as const, label: 'Paid' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'dueDate', align: 'left' as const, label: 'Due Date' },
  { id: 'createdAt', align: 'left' as const, label: 'Created' },
  { id: 'actions', align: 'center' as const, label: 'Actions' }
];

const paymentHeadCells = [
  { id: 'invoiceNumber', align: 'left' as const, label: 'Invoice #' },
  { id: 'patientName', align: 'left' as const, label: 'Patient' },
  { id: 'amount', align: 'right' as const, label: 'Amount' },
  { id: 'paymentMethod', align: 'left' as const, label: 'Method' },
  { id: 'referenceNumber', align: 'left' as const, label: 'Reference' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'paidAt', align: 'left' as const, label: 'Paid On' }
];

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box>{children}</Box> : null;
}

// ==============================|| EMPTY LINE ITEM ||============================== //

const emptyItem = (): Partial<InvoiceItem> => ({
  description: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
  itemType: null
});

// ==============================|| INVOICE DIALOG ||============================== //

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  editInvoice?: Invoice | null;
}

function InvoiceDialog({ open, onClose, editInvoice }: InvoiceDialogProps) {
  const isEdit = !!editInvoice;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [patientId, setPatientId] = useState(editInvoice?.patientId ?? '');
  const [invoiceNumber, setInvoiceNumber] = useState(editInvoice?.invoiceNumber ?? '');
  const [status, setStatus] = useState<InvoiceStatus>(editInvoice?.status ?? 'draft');
  const [currency, setCurrency] = useState(editInvoice?.currency ?? 'NGN');
  const [dueDate, setDueDate] = useState(editInvoice?.dueDate?.split('T')[0] ?? '');
  const [notes, setNotes] = useState(editInvoice?.notes ?? '');
  const [taxAmount, setTaxAmount] = useState(editInvoice?.taxAmount ?? 0);
  const [discountAmount, setDiscountAmount] = useState(editInvoice?.discountAmount ?? 0);
  const [items, setItems] = useState<Partial<InvoiceItem>[]>(
    isEdit ? [] : [emptyItem()]
  );

  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
  const totalAmount = isEdit ? (editInvoice?.totalAmount ?? 0) : subtotal + taxAmount - discountAmount;

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        item.totalPrice = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      }
      updated[index] = item;
      return updated;
    });
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setError('');
    if (!patientId.trim()) { setError('Patient ID is required'); return; }
    if (!invoiceNumber.trim()) { setError('Invoice number is required'); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await updateInvoice(editInvoice!.id, {
          patientId,
          invoiceNumber,
          status,
          subtotal: editInvoice!.subtotal,
          taxAmount,
          discountAmount,
          totalAmount: editInvoice!.subtotal + taxAmount - discountAmount,
          currency,
          dueDate: dueDate || null,
          notes: notes || null
        } as Partial<Invoice>);
      } else {
        if (items.length === 0 || !items[0].description) { setError('Add at least one line item'); setSaving(false); return; }
        await createInvoice({
          patientId,
          invoiceNumber,
          status,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          currency,
          dueDate: dueDate || undefined,
          notes: notes || undefined,
          items
        });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} fullWidth required size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} fullWidth required size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as InvoiceStatus)}>
                {INVOICE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{formatMethodLabel(s)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} fullWidth size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} fullWidth size="small" slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>
          <Grid size={12}>
            <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={2} size="small" />
          </Grid>
        </Grid>

        {/* Line items — only for new invoices */}
        {!isEdit && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">Line Items</Typography>
              <Button size="small" startIcon={<PlusOutlined />} onClick={addItem}>Add Item</Button>
            </Stack>
            {items.map((item, idx) => (
              <Grid container spacing={1} key={idx} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField label="Description" value={item.description ?? ''} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} fullWidth size="small" />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select value={item.itemType ?? ''} label="Type" onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}>
                      {ITEM_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>{formatMethodLabel(t)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField label="Qty" type="number" value={item.quantity ?? 1} onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))} fullWidth size="small" slotProps={{ htmlInput: { min: 1 } }} />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField label="Unit Price" type="number" value={item.unitPrice ?? 0} onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))} fullWidth size="small" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField label="Total" value={(item.totalPrice ?? 0).toFixed(2)} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
                </Grid>
                <Grid size={{ xs: 2, sm: 1 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton color="error" size="small" onClick={() => removeItem(idx)} disabled={items.length <= 1}>
                    <DeleteOutlined />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Tax" type="number" value={taxAmount} onChange={(e) => setTaxAmount(Number(e.target.value))} fullWidth size="small" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Discount" type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} fullWidth size="small" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Grand Total" value={totalAmount.toFixed(2)} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
              </Grid>
            </Grid>
          </>
        )}

        {/* Tax/discount only for edit */}
        {isEdit && (
          <>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Tax" type="number" value={taxAmount} onChange={(e) => setTaxAmount(Number(e.target.value))} fullWidth size="small" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Discount" type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} fullWidth size="small" slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Grand Total" value={((editInvoice?.subtotal ?? 0) + taxAmount - discountAmount).toFixed(2)} fullWidth size="small" slotProps={{ input: { readOnly: true } }} />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| PAYMENT DIALOG ||============================== //

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  invoices: Invoice[];
}

function PaymentDialog({ open, onClose, invoices }: PaymentDialogProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const selectedInvoice = invoices.find((inv) => inv.id === invoiceId);
  const outstanding = selectedInvoice ? selectedInvoice.totalAmount - selectedInvoice.amountPaid : 0;

  const handleSave = async () => {
    setError('');
    if (!invoiceId) { setError('Please select an invoice'); return; }
    if (amount <= 0) { setError('Amount must be greater than zero'); return; }

    setSaving(true);
    try {
      await createPayment({
        invoiceId,
        amount,
        paymentMethod,
        referenceNumber: referenceNumber || undefined,
        notes: notes || undefined
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Payment</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={12}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Invoice</InputLabel>
              <Select value={invoiceId} label="Invoice" onChange={(e) => { setInvoiceId(e.target.value); setAmount(0); }}>
                {invoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'cancelled' && inv.status !== 'refunded').map((inv) => (
                  <MenuItem key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.patientName} ({formatCurrency(inv.totalAmount - inv.amountPaid)} outstanding)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {selectedInvoice && (
            <Grid size={12}>
              <Alert severity="info">
                Total: {formatCurrency(selectedInvoice.totalAmount)} | Paid: {formatCurrency(selectedInvoice.amountPaid)} | Outstanding: {formatCurrency(outstanding)}
              </Alert>
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} fullWidth required size="small" slotProps={{ htmlInput: { min: 0, step: 0.01, max: outstanding || undefined } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Payment Method</InputLabel>
              <Select value={paymentMethod} label="Payment Method" onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
                {PAYMENT_METHODS.map((m) => (
                  <MenuItem key={m} value={m}>{formatMethodLabel(m)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <TextField label="Reference Number" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} fullWidth size="small" placeholder="Transaction ID, cheque number, etc." />
          </Grid>
          <Grid size={12}>
            <TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={2} size="small" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Record Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| BILLING PAGE ||============================== //

export default function BillingPage() {
  const [tabValue, setTabValue] = useState(0);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Dialogs
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Data
  const { invoices, invoicesLoading } = useGetInvoices();
  const { payments, paymentsLoading } = useGetPayments();
  const { stats, statsLoading } = useGetBillingStats();

  // Filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        invoiceSearch === '' ||
        inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        (inv.patientName ?? '').toLowerCase().includes(invoiceSearch.toLowerCase());
      const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, invoiceSearch, invoiceStatusFilter]);

  const filteredPayments = useMemo(() => {
    return payments.filter((pay: Payment) => {
      return (
        paymentSearch === '' ||
        (pay.invoiceNumber ?? '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
        (pay.patientName ?? '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
        (pay.referenceNumber ?? '').toLowerCase().includes(paymentSearch.toLowerCase())
      );
    });
  }, [payments, paymentSearch]);

  // Dialog handlers
  const handleOpenCreateInvoice = () => { setEditInvoice(null); setInvoiceDialogOpen(true); };
  const handleOpenEditInvoice = (invoice: Invoice) => { setEditInvoice(invoice); setInvoiceDialogOpen(true); };
  const handleCloseInvoiceDialog = () => { setInvoiceDialogOpen(false); setEditInvoice(null); };
  const handleOpenPayment = () => setPaymentDialogOpen(true);
  const handleClosePayment = () => setPaymentDialogOpen(false);

  const handleStatusChange = async (invoice: Invoice, newStatus: InvoiceStatus) => {
    try {
      await updateInvoiceStatus(invoice.id, newStatus);
    } catch {
      // error silently handled — SWR will revalidate
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Billing</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />} onClick={tabValue === 0 ? handleOpenCreateInvoice : handleOpenPayment}>
            {tabValue === 0 ? 'New Invoice' : 'Record Payment'}
          </Button>
        </Stack>
      </Grid>

      {/* Stat Cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Invoices"
          count={statsLoading ? '—' : String(stats?.totalInvoices ?? 0)}
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Revenue"
          count={statsLoading ? '—' : formatCurrency(stats?.totalRevenue ?? 0)}
          color="success"
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Outstanding"
          count={statsLoading ? '—' : formatCurrency(stats?.outstanding ?? 0)}
          color="warning"
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Overdue"
          count={statsLoading ? '—' : String(stats?.overdue ?? 0)}
          color="error"
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* Tabs + Tables */}
      <Grid size={12}>
        <MainCard content={false} boxShadow={undefined} subheader={undefined} darkTitle={undefined} elevation={undefined} secondary={undefined} shadow={undefined} title={undefined} codeHighlight={undefined} codeString={undefined} ref={undefined}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Invoices" />
              <Tab label="Payments" />
            </Tabs>
          </Box>

          {/* ============ TAB 0: Invoices ============ */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
                <TextField
                  placeholder="Search by invoice # or patient…"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  size="small"
                  sx={{ minWidth: 260 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined />
                        </InputAdornment>
                      )
                    }
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="inv-status-filter-label">Status</InputLabel>
                  <Select
                    labelId="inv-status-filter-label"
                    value={invoiceStatusFilter}
                    label="Status"
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {INVOICE_STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>{formatMethodLabel(s)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Box>
            <TableContainer
              sx={{
                width: '100%',
                overflowX: 'auto',
                position: 'relative',
                display: 'block',
                maxWidth: '100%',
                '& td, & th': { whiteSpace: 'nowrap' }
              }}
            >
              <Table aria-labelledby="invoicesTable">
                <TableHead>
                  <TableRow>
                    {invoiceHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicesLoading && (
                    <TableRow>
                      <TableCell colSpan={invoiceHeadCells.length} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!invoicesLoading &&
                    filteredInvoices.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{row.invoiceNumber}</Typography>
                        </TableCell>
                        <TableCell>{row.patientName ?? '—'}</TableCell>
                        <TableCell align="right">{formatCurrency(row.totalAmount, row.currency)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.amountPaid, row.currency)}</TableCell>
                        <TableCell>
                          <FormControl size="small" variant="standard" sx={{ minWidth: 120 }}>
                            <Select
                              value={row.status}
                              onChange={(e) => handleStatusChange(row, e.target.value as InvoiceStatus)}
                              disableUnderline
                              renderValue={(val) => <InvoiceStatusChip status={val as InvoiceStatus} />}
                            >
                              {INVOICE_STATUSES.map((s) => (
                                <MenuItem key={s} value={s}>{formatMethodLabel(s)}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>{formatDate(row.dueDate)}</TableCell>
                        <TableCell>{formatDate(row.createdAt)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenEditInvoice(row)}>
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!invoicesLoading && filteredInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={invoiceHeadCells.length} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No invoices found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ============ TAB 1: Payments ============ */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <TextField
                placeholder="Search by invoice #, patient, or reference…"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                size="small"
                sx={{ minWidth: 300 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>
            <TableContainer
              sx={{
                width: '100%',
                overflowX: 'auto',
                position: 'relative',
                display: 'block',
                maxWidth: '100%',
                '& td, & th': { whiteSpace: 'nowrap' }
              }}
            >
              <Table aria-labelledby="paymentsTable">
                <TableHead>
                  <TableRow>
                    {paymentHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentsLoading && (
                    <TableRow>
                      <TableCell colSpan={paymentHeadCells.length} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!paymentsLoading &&
                    filteredPayments.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.invoiceNumber ?? '—'}</TableCell>
                        <TableCell>{row.patientName ?? '—'}</TableCell>
                        <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                        <TableCell>{formatMethodLabel(row.paymentMethod)}</TableCell>
                        <TableCell>{row.referenceNumber ?? '—'}</TableCell>
                        <TableCell>
                          <PaymentStatusChip status={row.status} />
                        </TableCell>
                        <TableCell>{formatDate(row.paidAt)}</TableCell>
                      </TableRow>
                    ))}
                  {!paymentsLoading && filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={paymentHeadCells.length} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No payments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </MainCard>
      </Grid>

      {/* Dialogs */}
      {invoiceDialogOpen && (
        <InvoiceDialog open={invoiceDialogOpen} onClose={handleCloseInvoiceDialog} editInvoice={editInvoice} />
      )}
      {paymentDialogOpen && (
        <PaymentDialog open={paymentDialogOpen} onClose={handleClosePayment} invoices={invoices} />
      )}
    </Grid>
  );
}
