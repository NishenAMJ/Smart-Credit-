const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const transactions = [
  {
    id: 'txn-001',
    userId: 'user-001',
    type: 'loan_disbursement',
    amount: 5000,
    platformFee: 100,
    status: 'completed',
    description: 'Loan disbursement to borrower',
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-15')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-15')),
  },
  {
    id: 'txn-002',
    userId: 'user-002',
    type: 'repayment',
    amount: 1200,
    platformFee: 24,
    status: 'completed',
    description: 'Monthly loan repayment',
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-20')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-01-20')),
  },
  {
    id: 'txn-003',
    userId: 'user-004',
    type: 'loan_disbursement',
    amount: 10000,
    platformFee: 200,
    status: 'completed',
    description: 'Loan disbursement to borrower',
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-02-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-02-01')),
  },
  {
    id: 'txn-004',
    userId: 'user-003',
    type: 'repayment',
    amount: 2500,
    platformFee: 50,
    status: 'completed',
    description: 'Loan repayment',
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-02-10')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-02-10')),
  },
  {
    id: 'txn-005',
    userId: 'user-005',
    type: 'withdrawal',
    amount: 3000,
    fee: 30,
    status: 'pending',
    description: 'Withdrawal request',
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-01')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-01')),
  },
  {
    id: 'txn-006',
    userId: 'user-006',
    type: 'deposit',
    amount: 5000,
    fee: 0,
    status: 'completed',
    description: 'Account deposit',
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-05')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2024-03-05')),
  },
  {
    id: 'txn-007',
    userId: 'user-001',
    type: 'repayment',
    amount: 1500,
    platformFee: 30,
    status: 'completed',
    description: 'Monthly repayment',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  },
  {
    id: 'txn-008',
    userId: 'user-002',
    type: 'loan_disbursement',
    amount: 7500,
    platformFee: 150,
    status: 'completed',
    description: 'Loan disbursement',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  },
  {
    id: 'txn-009',
    userId: 'user-004',
    type: 'repayment',
    amount: 2000,
    platformFee: 40,
    status: 'failed',
    description: 'Failed payment',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  },
  {
    id: 'txn-010',
    userId: 'user-005',
    type: 'loan_disbursement',
    amount: 15000,
    platformFee: 300,
    status: 'completed',
    description: 'Large loan disbursement',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  },
];

async function seedTransactions() {
  try {
    const batch = db.batch();

    transactions.forEach((transaction) => {
      const docRef = db.collection('transactions').doc(transaction.id);
      batch.set(docRef, transaction);
    });

    await batch.commit();
    console.log('✅ Successfully seeded transactions data');
    console.log(`📊 Created ${transactions.length} transactions`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding transactions:', error);
    process.exit(1);
  }
}

seedTransactions();
