export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

export function sendBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }
}

export function checkLeaveReturnReminders(
  leaveRequests: { id: string; endDate: string; status: string }[]
): string[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const reminders: string[] = [];

  leaveRequests.forEach((leave) => {
    if (leave.status === 'approved') {
      if (leave.endDate === tomorrowStr) {
        const msg = `Smart Return Reminder: Your approved leave ends tomorrow (${leave.endDate}). Please return to the hostel by 7:00 PM.`;
        reminders.push(msg);
        sendBrowserNotification('Hostel Leave Return Reminder', msg);
      } else if (leave.endDate === todayStr) {
        const msg = `Smart Return Reminder: Your approved leave ends TODAY (${leave.endDate}). Please report to the hostel before curfew.`;
        reminders.push(msg);
        sendBrowserNotification('Hostel Leave Return Reminder', msg);
      }
    }
  });

  return reminders;
}
