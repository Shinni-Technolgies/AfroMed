/** @type {import('swagger-ui-express').JsonObject} */
const spec = {
  openapi: '3.0.3',
  info: {
    title: 'AfroMed API',
    version: '1.0.0',
    description:
      'REST API for the AfroMed medical dashboard. All endpoints are read-only (GET). ' +
      'Base URL in development: **http://localhost:8080**',
  },
  servers: [
    { url: 'http://localhost:8080', description: 'Local development server' },
  ],
  tags: [
    { name: 'Health', description: 'Server health check' },
    { name: 'Organizations', description: 'Tenant organizations (no auth required)' },
    { name: 'Patients', description: 'Patient records and statistics' },
    { name: 'Doctors', description: 'Doctor profiles and statistics' },
    { name: 'Appointments', description: 'Appointment scheduling and statistics' },
    { name: 'Pharmacy', description: 'Medication inventory and statistics' },
    { name: 'Health Records', description: 'Patient health records and statistics' },
  ],
  paths: {
    // ─── Health ────────────────────────────────────────────────────────────
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Server health check',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Server is running',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } },
              },
            },
          },
        },
      },
    },

    // ─── Organizations ──────────────────────────────────────────────────────
    '/api/organizations': {
      get: {
        tags: ['Organizations'],
        summary: 'List all active organizations',
        operationId: 'getOrganizations',
        responses: {
          200: {
            description: 'List of active organizations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Organization' } },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    // ─── Patients ──────────────────────────────────────────────────────────
    '/api/patients': {
      get: {
        tags: ['Patients'],
        summary: 'List all patients',
        operationId: 'getPatients',
        responses: {
          200: {
            description: 'Paginated list of patients',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PatientListResponse' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/patients/stats': {
      get: {
        tags: ['Patients'],
        summary: 'Get patient statistics',
        operationId: 'getPatientStats',
        responses: {
          200: {
            description: 'Aggregate patient counts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PatientStats' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Get a patient by ID',
        operationId: 'getPatientById',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Patient object',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Patient' } },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    // ─── Doctors ───────────────────────────────────────────────────────────
    '/api/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List all doctors',
        operationId: 'getDoctors',
        responses: {
          200: {
            description: 'Paginated list of doctors',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DoctorListResponse' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/doctors/stats': {
      get: {
        tags: ['Doctors'],
        summary: 'Get doctor statistics',
        operationId: 'getDoctorStats',
        responses: {
          200: {
            description: 'Aggregate doctor counts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DoctorStats' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get a doctor by ID',
        operationId: 'getDoctorById',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Doctor object',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Doctor' } },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    // ─── Appointments ──────────────────────────────────────────────────────
    '/api/appointments': {
      get: {
        tags: ['Appointments'],
        summary: 'List all appointments',
        operationId: 'getAppointments',
        responses: {
          200: {
            description: 'Paginated list of appointments',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AppointmentListResponse' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/appointments/stats': {
      get: {
        tags: ['Appointments'],
        summary: 'Get appointment statistics',
        operationId: 'getAppointmentStats',
        responses: {
          200: {
            description: 'Aggregate appointment counts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AppointmentStats' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/appointments/{id}': {
      get: {
        tags: ['Appointments'],
        summary: 'Get an appointment by ID',
        operationId: 'getAppointmentById',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Appointment object',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Appointment' } },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    // ─── Pharmacy ──────────────────────────────────────────────────────────
    '/api/pharmacy/medications': {
      get: {
        tags: ['Pharmacy'],
        summary: 'List all medications',
        operationId: 'getMedications',
        responses: {
          200: {
            description: 'Paginated list of medications',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MedicationListResponse' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/pharmacy/stats': {
      get: {
        tags: ['Pharmacy'],
        summary: 'Get pharmacy / medication statistics',
        operationId: 'getPharmacyStats',
        responses: {
          200: {
            description: 'Aggregate medication counts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PharmacyStats' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },

    // ─── Health Records ────────────────────────────────────────────────────
    '/api/health-records': {
      get: {
        tags: ['Health Records'],
        summary: 'List all health records',
        operationId: 'getHealthRecords',
        responses: {
          200: {
            description: 'Paginated list of health records',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthRecordListResponse' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/health-records/stats': {
      get: {
        tags: ['Health Records'],
        summary: 'Get health record statistics',
        operationId: 'getHealthRecordStats',
        responses: {
          200: {
            description: 'Aggregate health record counts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthRecordStats' },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/health-records/{id}': {
      get: {
        tags: ['Health Records'],
        summary: 'Get a health record by ID',
        operationId: 'getHealthRecordById',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Health record object',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/HealthRecord' } },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },

  components: {
    parameters: {
      OrgIdHeader: {
        name: 'x-org-id',
        in: 'header',
        required: true,
        description: 'Organization UUID for multi-tenant RLS filtering',
        schema: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
      },
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'UUID record ID',
        schema: { type: 'string', format: 'uuid' },
      },
    },

    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { error: 'Resource not found' },
          },
        },
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { error: 'Database connection failed' },
          },
        },
      },
    },

    schemas: {
      // ── Organization ─────────────────────────────────────────────────────
      Organization: {
        type: 'object',
        properties: {
          org_id:   { type: 'string', format: 'uuid' },
          name:     { type: 'string', example: 'Lagos General Hospital' },
          slug:     { type: 'string', example: 'lagos-general' },
          city:     { type: 'string', example: 'Lagos' },
          state:    { type: 'string', example: 'Lagos' },
          country:  { type: 'string', example: 'Nigeria' },
          logo_url: { type: 'string', nullable: true },
        },
      },

      // ── Generic ──────────────────────────────────────────────────────────
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Something went wrong' },
        },
      },

      // ── Patients ─────────────────────────────────────────────────────────
      Patient: {
        type: 'object',
        properties: {
          id:        { type: 'integer', example: 1 },
          name:      { type: 'string',  example: 'Amara Diallo' },
          age:       { type: 'integer', example: 34 },
          gender:    { type: 'string',  example: 'Female' },
          contact:   { type: 'string',  example: '+233-24-555-0100' },
          status: {
            type: 'string',
            enum: ['Active', 'Discharged', 'Critical'],
            example: 'Active',
          },
          lastVisit: { type: 'string', format: 'date', example: '2026-02-15' },
        },
      },
      PatientListResponse: {
        type: 'object',
        properties: {
          data:  { type: 'array', items: { $ref: '#/components/schemas/Patient' } },
          total: { type: 'integer', example: 120 },
        },
      },
      PatientStats: {
        type: 'object',
        properties: {
          totalPatients: { type: 'integer', example: 120 },
          newThisMonth:  { type: 'integer', example: 14 },
          activeCases:   { type: 'integer', example: 85 },
          discharged:    { type: 'integer', example: 30 },
        },
      },

      // ── Doctors ──────────────────────────────────────────────────────────
      Doctor: {
        type: 'object',
        properties: {
          id:         { type: 'integer', example: 1 },
          name:       { type: 'string',  example: 'Dr. Kwame Mensah' },
          specialty: {
            type: 'string',
            enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Oncology', 'Ophthalmology'],
            example: 'Cardiology',
          },
          contact:    { type: 'string',  example: '+233-30-555-0200' },
          experience: { type: 'string',  example: '10 years' },
          status: {
            type: 'string',
            enum: ['Available', 'On Duty', 'On Leave'],
            example: 'On Duty',
          },
          rating: { type: 'number', format: 'float', example: 4.8 },
        },
      },
      DoctorListResponse: {
        type: 'object',
        properties: {
          data:  { type: 'array', items: { $ref: '#/components/schemas/Doctor' } },
          total: { type: 'integer', example: 40 },
        },
      },
      DoctorStats: {
        type: 'object',
        properties: {
          totalDoctors: { type: 'integer', example: 40 },
          onDuty:       { type: 'integer', example: 22 },
          onLeave:      { type: 'integer', example: 5 },
          specialists:  { type: 'integer', example: 28 },
        },
      },

      // ── Appointments ─────────────────────────────────────────────────────
      Appointment: {
        type: 'object',
        properties: {
          id:          { type: 'integer', example: 1 },
          patientName: { type: 'string',  example: 'Fatima Sessay' },
          doctor:      { type: 'string',  example: 'Dr. Kwame Mensah' },
          department:  { type: 'string',  example: 'Cardiology' },
          dateTime: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-10T09:00:00.000Z',
          },
          type: {
            type: 'string',
            enum: ['Checkup', 'Follow-up', 'Emergency', 'Consultation'],
            example: 'Checkup',
          },
          status: {
            type: 'string',
            enum: ['Scheduled', 'Completed', 'Cancelled', 'In Progress'],
            example: 'Scheduled',
          },
        },
      },
      AppointmentListResponse: {
        type: 'object',
        properties: {
          data:  { type: 'array', items: { $ref: '#/components/schemas/Appointment' } },
          total: { type: 'integer', example: 200 },
        },
      },
      AppointmentStats: {
        type: 'object',
        properties: {
          todayAppointments: { type: 'integer', example: 18 },
          upcoming:          { type: 'integer', example: 45 },
          completed:         { type: 'integer', example: 130 },
          cancelled:         { type: 'integer', example: 12 },
        },
      },

      // ── Medications ──────────────────────────────────────────────────────
      Medication: {
        type: 'object',
        properties: {
          id:         { type: 'integer', example: 1 },
          name:       { type: 'string',  example: 'Amoxicillin 500mg' },
          category:   { type: 'string',  example: 'Antibiotic' },
          stockQty:   { type: 'integer', example: 250 },
          unitPrice:  { type: 'number',  format: 'float', example: 2.5 },
          supplier:   { type: 'string',  example: 'PharmaCo Ltd' },
          expiryDate: { type: 'string',  format: 'date', example: '2027-06-30' },
          status: {
            type: 'string',
            enum: ['In Stock', 'Low Stock', 'Out of Stock'],
            example: 'In Stock',
          },
        },
      },
      MedicationListResponse: {
        type: 'object',
        properties: {
          data:  { type: 'array', items: { $ref: '#/components/schemas/Medication' } },
          total: { type: 'integer', example: 80 },
        },
      },
      PharmacyStats: {
        type: 'object',
        properties: {
          totalMedications: { type: 'integer', example: 80 },
          inStock:          { type: 'integer', example: 55 },
          lowStock:         { type: 'integer', example: 18 },
          outOfStock:       { type: 'integer', example: 7 },
        },
      },

      // ── Health Records ────────────────────────────────────────────────────
      HealthRecord: {
        type: 'object',
        properties: {
          id:          { type: 'integer', example: 1 },
          patientName: { type: 'string',  example: 'Kofi Acheampong' },
          recordType: {
            type: 'string',
            enum: ['Lab Result', 'Prescription', 'Medical Report', 'Imaging', 'Discharge Summary'],
            example: 'Lab Result',
          },
          doctor:      { type: 'string', example: 'Dr. Afia Boateng' },
          dateCreated: { type: 'string', format: 'date', example: '2026-01-20' },
          status: {
            type: 'string',
            enum: ['Active', 'Archived'],
            example: 'Active',
          },
        },
      },
      HealthRecordListResponse: {
        type: 'object',
        properties: {
          data:  { type: 'array', items: { $ref: '#/components/schemas/HealthRecord' } },
          total: { type: 'integer', example: 340 },
        },
      },
      HealthRecordStats: {
        type: 'object',
        properties: {
          totalRecords:   { type: 'integer', example: 340 },
          labResults:     { type: 'integer', example: 120 },
          prescriptions:  { type: 'integer', example: 95 },
          medicalReports: { type: 'integer', example: 80 },
        },
      },
    },
  },
};

module.exports = spec;
