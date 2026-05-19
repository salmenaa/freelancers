document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('housingForm');
  const rent = document.getElementById('rentAmount');
  const owner = document.getElementById('ownerName');
  const dateFrom = document.getElementById('dateFrom');
  const dateTo = document.getElementById('dateTo');
  const attachment = document.getElementById('attachment');
  const attachmentInfo = document.getElementById('attachmentInfo');
  const message = document.getElementById('message');

  attachment.addEventListener('change', () => {
    const file = attachment.files[0];
    if (!file) {
      attachmentInfo.textContent = '';
      return;
    }
    attachmentInfo.textContent = `${file.name} (${Math.round(file.size/1024)} KB)`;
  });

  function showMessage(text, isError) {
    message.textContent = text;
    message.style.color = isError ? '#b00020' : '#006600';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // Basic validation
    const rentVal = parseFloat(rent.value);
    if (isNaN(rentVal) || rentVal <= 0) {
      showMessage('Please enter a valid rent amount greater than 0.', true);
      return;
    }
    if (!owner.value.trim()) {
      showMessage('Owner name is required.', true);
      return;
    }
    if (!dateFrom.value || !dateTo.value) {
      showMessage('Please select both dates.', true);
      return;
    }
    const from = new Date(dateFrom.value);
    const to = new Date(dateTo.value);
    if (to < from) {
      showMessage('"Date to" must be the same or after "Date from".', true);
      return;
    }
    const file = attachment.files[0];

    function saveRecord(attachmentName, attachmentType, attachmentDataUrl) {
      const record = {
        id: 'req-' + Date.now(),
        rentAmount: rentVal,
        ownerName: owner.value.trim(),
        dateFrom: dateFrom.value,
        dateTo: dateTo.value,
        notes: document.getElementById('notes').value.trim(),
        attachmentName: attachmentName || null,
        attachmentType: attachmentType || null,
        attachmentDataUrl: attachmentDataUrl || null,
        createdAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('housingRequests') || '[]');
        existing.push(record);
        localStorage.setItem('housingRequests', JSON.stringify(existing));
        showMessage('Housing request saved locally.');
        form.reset();
        attachmentInfo.textContent = '';
      } catch (err) {
        console.error(err);
        showMessage('Failed to save request.', true);
      }
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        saveRecord(file.name, file.type, reader.result);
      };
      reader.onerror = function () {
        showMessage('Failed to read attachment file.', true);
      };
      reader.readAsDataURL(file);
    } else {
      // No attachment provided — save without attachment
      saveRecord(null, null, null);
    }
  });
});
