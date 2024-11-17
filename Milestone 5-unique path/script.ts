document.getElementById('resumeForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    // Type assertions for form elements
    const nameElement = document.getElementById('name') as HTMLInputElement;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const phoneElement = document.getElementById('phone') as HTMLInputElement;
    const educationElement = document.getElementById('education') as HTMLInputElement;
    const experienceElement = document.getElementById('experience') as HTMLInputElement;
    const skillsElement = document.getElementById('skills') as HTMLInputElement;
    const usernameElement = document.getElementById('username') as HTMLInputElement;

    if (nameElement && emailElement && phoneElement && educationElement && experienceElement && skillsElement && usernameElement) {
        const name = nameElement.value;
        const email = emailElement.value;
        const phone = phoneElement.value;
        const education = educationElement.value;
        const experience = experienceElement.value;
        const skills = skillsElement.value;
        const username = usernameElement.value.trim(); // Trim to avoid extra spaces in the username
        const uniquePath = generateFilePath(username);

        // Generate the resume HTML output
        const resumeOutput = `
            <h2>Resume</h2>
            <p><strong>Name:</strong> <span id="edit-name" class="editable">${name}</span></p>
            <p><strong>Email:</strong> <span id="edit-email" class="editable">${email}</span></p>
            <p><strong>Phone:</strong> <span id="edit-phone" class="editable">${phone}</span></p>
            <h3>Education</h3>
            <p id="edit-education" class="editable">${education}</p>
            <h3>Experience</h3>
            <p id="edit-experience" class="editable">${experience}</p>
            <h3>Skills</h3>
            <p id="edit-skills" class="editable">${skills}</p>
        `;

        // Create the download link
        const downloadLink = createDownloadLink(uniquePath, resumeOutput);

        // Display the resume output
        const resumeOutputElement = document.getElementById('resumeOutput');
        if (resumeOutputElement) {
            resumeOutputElement.innerHTML = resumeOutput;
            resumeOutputElement.classList.remove('hidden');

            // Create and append action buttons
            const buttonsContainer = createButtons(username);
            resumeOutputElement.appendChild(buttonsContainer);
            resumeOutputElement.appendChild(downloadLink);

            // Make fields editable
            makeEditable();
        }
    } else {
        console.error('One or more form elements are missing');
    }
});

// Function to generate a sanitized file path for the resume
function generateFilePath(username: string): string {
    return `resumes/${username.replace(/\s+/g, '_').replace(/[^\w\s-_]/g, '')}_cv.html`;
}

// Function to create a downloadable link for the resume
function createDownloadLink(path: string, content: string): HTMLAnchorElement {
    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(content);
    downloadLink.download = path;
    downloadLink.textContent = 'Download Your 2024 Resume';
    return downloadLink;
}

// Function to create the buttons (Download PDF and Copy Shareable Link)
function createButtons(username: string): HTMLDivElement {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttonsContainer';

    // Download as PDF button
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download as PDF';
    downloadButton.addEventListener('click', () => {
        window.print(); // Open the print dialog, allowing the user to save as PDF.
    });
    buttonsContainer.appendChild(downloadButton);

    // Copy shareable link button
    const shareLinkButton = document.createElement('button');
    shareLinkButton.textContent = 'Copy Shareable Link';
    shareLinkButton.addEventListener('click', async () => {
        try {
            const shareableLink = `https://yourdomain.com/resume/${generateFilePath(username)}`;
            await navigator.clipboard.writeText(shareableLink);
            alert('Shareable link copied to clipboard');
        } catch (err) {
            console.error('Failed to copy link:', err);
            alert('Failed to copy link to clipboard. Please try again.');
        }
    });
    buttonsContainer.appendChild(shareLinkButton);

    return buttonsContainer;
}

// Function to make the resume fields editable
function makeEditable() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', function() {
            const currentElement = element as HTMLElement;
            const currentValue = currentElement.textContent || '';

            // If the element is a <span> or <p>, replace it with an <input>
            if (currentElement.tagName === 'P' || currentElement.tagName === 'SPAN') {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.classList.add('editing', 'input');

                // Update the field content when the input loses focus
                input.addEventListener('blur', function() {
                    currentElement.textContent = input.value;
                    currentElement.style.display = 'inline';
                    input.remove();
                });

                // Hide the text content and insert the input
                currentElement.style.display = 'none';
                currentElement.parentNode?.insertBefore(input, currentElement);
                input.focus();
            }
        });
    });
}
