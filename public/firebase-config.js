export const firebaseConfig = {
  apiKey: 'AIzaSyCLRj1-2ghoQgBHGKSSBcq3jag2m7sjamM',
  authDomain: 'mbg-matematika.firebaseapp.com',
  projectId: 'mbg-matematika',
  storageBucket: 'mbg-matematika.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890'
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
