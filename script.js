document.addEventListener('DOMContentLoaded', () => {
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const contactList = document.getElementById('contactList');
const errorMessage = document.getElementById('errorMessage');

// Load existing contacts on page load
loadContacts();

// Submit handler to add new contact
contactForm.addEventListener('submit', async (e) => {
e.preventDefault();
clearError();

const name = nameInput.value.trim();
const phone = phoneInput.value.trim();

if (!validateName(name)) {
showError('Please enter a valid name (at least 2 characters).');
return;
}
if (!validatePhone(phone)) {
showError('Please enter a valid Indian phone number.');
return;
}

// Format the phone number as '+91 9876543210'
const formattedPhone = formatPhone(phone);

const contact = { name, phone: formattedPhone };

try {
await addContact(contact);
contactForm.reset();
nameInput.focus();
} catch (error) {
showError(error.message || 'Failed to add contact. Please try again.');
console.error(error);
}
});

// Validate Indian phone number with optional country code (+91 or 0)
function validatePhone(phone) {
const regex = /^(?:\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;
return regex.test(phone);
}

// Simple name validation (at least 2 characters)
function validateName(name) {
return name.length >= 2;
}

// Display error message
function showError(msg) {
errorMessage.textContent = msg;
errorMessage.style.display = 'block';
}

// Clear error message
function clearError() {
errorMessage.textContent = '';
errorMessage.style.display = 'none';
}

// Load contacts from localStorage and render
function loadContacts() {
const contactsJSON = localStorage.getItem('contacts');
const contacts = contactsJSON ? JSON.parse(contactsJSON) : [];
renderContacts(contacts);
}

// Save contacts to localStorage
function saveContacts(contacts) {
localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Add contact asynchronously (simulate Fetch API)
async function addContact(contact) {
// Simulate network delay
await new Promise((resolve) => setTimeout(resolve, 300));

const contactsJSON = localStorage.getItem('contacts');
const contacts = contactsJSON ? JSON.parse(contactsJSON) : [];

// Check for duplicate phone number
if (contacts.some(c => c.phone === contact.phone)) {
throw new Error('Phone number already exists.');
}

contacts.push({ id: Date.now(), ...contact });
saveContacts(contacts);
renderContacts(contacts);
}

// Delete contact by id asynchronously (simulate Fetch API)
async function deleteContact(id) {
// Simulate network delay
await new Promise((resolve) => setTimeout(resolve, 200));

let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
contacts = contacts.filter((c) => c.id !== id);
saveContacts(contacts);
renderContacts(contacts);
}

// Render contacts list UI with Edit functionality
function renderContacts(contacts) {
contactList.innerHTML = '';
if (contacts.length === 0) {
contactList.innerHTML = '<li class="list-group-item text-center text-muted">No contacts found</li>';
return;
}

contacts.forEach(({ id, name, phone }) => {
const li = document.createElement('li');
li.classList.add('list-group-item');
li.dataset.id = id;

li.innerHTML = `
<div>
  <strong>${escapeHTML(name)}</strong> - <span>${escapeHTML(phone)}</span>
</div>
<div>
  <button class="btn btn-sm btn-primary edit-btn" style="margin-right:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg></button>
  <button class="btn btn-sm btn-danger delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>
</div>
`;

// Edit handler
li.querySelector('.edit-btn').addEventListener('click', () => {
enterEditMode(li, { id, name, phone });
});

// Delete handler
li.querySelector('.delete-btn').addEventListener('click', () => {
if (confirm(`Delete contact "${name}"?`)) {
  deleteContact(id).catch((err) => {
    showError('Failed to delete contact. Please try again.');
    console.error(err);
  });
}
});

contactList.appendChild(li);
});
}

// Enter edit mode for a contact
function enterEditMode(li, contact) {
li.innerHTML = `
<div>
<input type="text" class="form-control form-control-sm edit-name" value="${escapeHTML(contact.name)}" style="width: 130px; display: inline-block;">
<input type="text" class="form-control form-control-sm edit-phone" value="${escapeHTML(contact.phone)}" style="width: 140px; display: inline-block; margin-left: 8px;">
</div>
<div style="margin-top:8px;">
<button class="btn btn-sm btn-success save-btn" style="margin-right:0.5rem;">Save</button>
<button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
</div>
`;

li.querySelector('.save-btn').addEventListener('click', async () => {
clearError();
const newName = li.querySelector('.edit-name').value.trim();
const newPhone = li.querySelector('.edit-phone').value.trim();

if (!validateName(newName)) {
showError('Please enter a valid name (at least 2 characters).');
return;
}
if (!validatePhone(newPhone)) {
showError('Please enter a valid Indian phone number.');
return;
}

try {
await updateContact(contact.id, newName, formatPhone(newPhone));
} catch (e) {
showError(e.message || 'Failed to update contact.');
return;
}
clearError();
});

li.querySelector('.cancel-btn').addEventListener('click', () => {
clearError();
loadContacts();
});
}

// Update contact in storage
async function updateContact(id, newName, newPhone) {
await new Promise(resolve => setTimeout(resolve, 150));
let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
// Check for duplicate (ignore self)
if (contacts.some(c => c.id !== id && c.phone === newPhone)) {
throw new Error('Phone number already exists.');
}
contacts = contacts.map(c =>
c.id === id ? { ...c, name: newName, phone: newPhone } : c
);
saveContacts(contacts);
renderContacts(contacts);
}

// Format phone to standard Indian format: +91 9876543210
function formatPhone(phone) {
// Remove spaces, hyphens, parentheses
phone = phone.replace(/[\s\-\(\)]/g, '');
// Remove country code or leading zero
if (phone.startsWith('+91')) {
phone = phone.slice(3);
} else if (phone.startsWith('91')) {
phone = phone.slice(2);
} else if (phone.startsWith('0')) {
phone = phone.slice(1);
}
// Only keep last 10 digits (if user enters extra digits accidentally)
phone = phone.slice(-10);
// Return '+91 ' plus 10 digit number
return '+91 ' + phone;
}

// Simple HTML escaping to prevent injection
function escapeHTML(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
}
});