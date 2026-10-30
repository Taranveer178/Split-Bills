import Dashboard from './dashboard/Dashboard';

const demoUser = {
  id: 'landing-preview-user',
  username: 'Taranveer',
  email: 'taranveer@example.com',
  pinnedGroupIds: ['landing-preview-flat'],
  archivedGroupIds: [],
  mutedGroupIds: [],
};

const demoUsers = [
  { id: demoUser.id, username: demoUser.username },
  { id: 'landing-preview-sushant', username: 'Sushant' },
  { id: 'landing-preview-tanmay', username: 'Tanmay' },
  { id: 'landing-preview-aarav', username: 'Aarav' },
];

const demoGroups = [
  {
    id: 'landing-preview-flat',
    name: 'Flat 402 · Mohali',
    members: demoUsers.slice(0, 3).map((member) => member.id),
    currency: 'INR',
    inviteCode: 'FLT402',
  },
  {
    id: 'landing-preview-trip',
    name: 'Kasol Weekend Trip',
    members: [demoUser.id, demoUsers[1].id, demoUsers[3].id],
    currency: 'INR',
    inviteCode: 'KASOL4',
  },
  {
    id: 'landing-preview-lunch',
    name: 'Office Lunch Club',
    members: [demoUser.id, demoUsers[2].id, demoUsers[3].id],
    currency: 'INR',
    inviteCode: 'LUNCH4',
  },
];

const today = new Date();
const todayKey = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-');
const createdAt = today.toISOString();

const demoExpenses = [
  {
    id: 'landing-preview-expense-1',
    groupId: 'landing-preview-flat',
    title: 'Monthly electricity bill',
    totalAmount: '2400',
    paidBy: demoUser.id,
    createdBy: demoUser.id,
    category: 'Utilities',
    paymentMethod: 'UPI',
    date: todayKey,
    createdAt,
    splits: {
      [demoUser.id]: '800',
      [demoUsers[1].id]: '800',
      [demoUsers[2].id]: '800',
    },
  },
  {
    id: 'landing-preview-expense-2',
    groupId: 'landing-preview-flat',
    title: 'Groceries',
    totalAmount: '1800',
    paidBy: demoUsers[1].id,
    createdBy: demoUsers[1].id,
    category: 'Shopping',
    paymentMethod: 'UPI',
    date: todayKey,
    createdAt,
    splits: {
      [demoUser.id]: '600',
      [demoUsers[1].id]: '600',
      [demoUsers[2].id]: '600',
    },
  },
  {
    id: 'landing-preview-expense-3',
    groupId: 'landing-preview-trip',
    title: 'Dinner after the hike',
    totalAmount: '1350',
    paidBy: demoUsers[3].id,
    createdBy: demoUsers[3].id,
    category: 'Food',
    paymentMethod: 'UPI',
    date: todayKey,
    createdAt,
    splits: {
      [demoUser.id]: '450',
      [demoUsers[1].id]: '450',
      [demoUsers[3].id]: '450',
    },
  },
];

export default function LandingDashboardPreview({ initialTab = 'groups' }) {
  return (
    <div className="landing-dashboard-preview relative h-full w-full overflow-hidden bg-white [transform:translateZ(0)]">
      <Dashboard
        key={initialTab}
        user={demoUser}
        users={demoUsers}
        groups={demoGroups}
        expenses={demoExpenses}
        notifications={[]}
        rentRecords={[]}
        initialTab={initialTab}
        mobilePreview
        theme="light"
        isAppInstalled
        onOpenGroup={() => {}}
        onCreateGroup={() => {}}
        onJoinGroup={() => {}}
        onSaveExpense={() => {}}
        onDeleteExpense={() => {}}
        onRaiseExpenseDispute={() => {}}
        onCancelExpenseDispute={() => {}}
        onMarkRentPaid={() => {}}
        onSendNotification={() => {}}
        onUpdateUser={() => {}}
        onMarkNotificationsRead={() => {}}
        onClearNotifications={() => {}}
        onTabChange={() => {}}
        showToast={() => {}}
      />
    </div>
  );
}
