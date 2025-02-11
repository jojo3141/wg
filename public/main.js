


document.addEventListener('DOMContentLoaded', () => {

const STORAGE_PLACE = "placeInLocalStorage";
const ALL_NAMES = ["Franek", "Josia", "Livia", "Noella", "Jeanne"]

const username = localStorage.getItem(STORAGE_PLACE);

    if (ALL_NAMES.includes(username)) {
        console.log("USER:", username)
        ALL_NAMES.forEach(function(name){
            document.getElementById(name + "_Button").style.display = "none";
            if(name!=username) {
                document.getElementById(name).style.display = "none";
            }
        })
    } else {
        console.log("No User")
        showStartButtons();
    }
    
    ALL_NAMES.forEach(function(name) {
        document.getElementById(name + "_Button").addEventListener("click", function(){
            localStorage.setItem(STORAGE_PLACE, name);
            window.location.reload();
        })
    })
    
    function showStartButtons() {
        ALL_NAMES.forEach(function(name) {
            document.getElementById(name + "_Button").style.display = "block";
            document.getElementById(name).style.display = "none";
            
        })
        
    }

    let tasks = [];
    const weeksInMillisec = 7 * 24 * 60 * 60 * 1000;

    // Fetch the tasks from the server
    fetch('/jobs')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            distributeJobs(tasks);  // Assign jobs to people
            console.log("tasks", tasks);
        });

    // Distribute the jobs among the people
    function distributeJobs(jobs) {
        const peopleJobs = {
            'Noella': [],
            'Jeanne': [],
            'Josia': [],
            'Livia': [],
            'Franek': []
        };
    
        jobs.forEach(job => {
            peopleJobs[job.person].push(job);
        });
    
        // Update the UI to reflect the jobs for each person
        for (const person in peopleJobs) {
            const jobList = peopleJobs[person];
            const personSection = document.getElementById(person);  // Select the div with the person's name as id
            
            document.querySelectorAll(".person-name").forEach(function(elem) {
                    elem.addEventListener("click", function() {
                        showStartButtons();
                    });
                
                
            });
            
            

            const tasksDiv = personSection.querySelector('.tasks');
            tasksDiv.innerHTML = '';  // Clear old tasks content
    
            jobList.forEach(job => {
                const jobElement = document.createElement('div');
                jobElement.classList.add('job');
    
                // Create and style the title (bold)
                const titleElement = document.createElement('div');
                titleElement.textContent = job.title;
                titleElement.classList.add("jobTitle");
    
                // Create a line break after the title
                const lineBreak1 = document.createElement('br');
    
                // Create the description (if it exists)
                const descriptionElement = document.createElement('span');
                if (job.description) {
                    descriptionElement.textContent = job.description;
                    descriptionElement.classList.add("description");  // Apply brown color to the description
                }


    
                // Create another line break after the description
                const lineBreak2 = document.createElement('br');
                const lineBreak3 = document.createElement('br');
    
                // Create the deadline element
                const deadlineElement = document.createElement('span');
                deadlineElement.textContent = `${job.deadline} days left`;
    
                // Create the "Done" button
                const doneButton = document.createElement('button');
                doneButton.textContent = 'Done';
                doneButton.classList.add('done-btn');
                doneButton.onclick = () => markJobAsDone(job);
    
                // Append all elements to the jobElement
                jobElement.appendChild(titleElement);
                jobElement.appendChild(lineBreak1);
                if (job.description) {
                    jobElement.appendChild(descriptionElement);
                    jobElement.appendChild(lineBreak2);
                    jobElement.appendChild(lineBreak3);
                }
                jobElement.appendChild(deadlineElement);
                jobElement.appendChild(doneButton);
    
                // Append the jobElement to the tasksDiv
                tasksDiv.appendChild(jobElement);
            });
        }
    }
    

    // Mark a job as done and assign it to the next person
    function markJobAsDone(job) {
        const today = new Date();

        triggerFireworks();


        // Send the updated job to the server
        fetch(`/update-job/${job.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                person: job.person,        // Send the current person doing the job
                last_done: formatDateTime(new Date())  // Set last_done to today
            })
        })
        .then(response => response.json())
        .then(updatedJob => {
            console.log('Job updated successfully:', updatedJob);  // Log the updated job

            // Check if the updated job is valid and contains required properties
            if (!updatedJob || !updatedJob.person || !updatedJob.last_done) {
                console.error("Invalid job data returned from the server:", updatedJob);
                return;  // Exit if the job is invalid
            }

            // Find the index of the job in the tasks array
            const jobIndex = tasks.findIndex(t => t.id === parseInt(updatedJob.id));
            
            if (jobIndex === -1) {
                console.error(`Job with ID ${updatedJob.id} not found in tasks array`);
                return;  // Exit if the job is not found
            }

            // Update the tasks array with the new person and last_done
            tasks[jobIndex].person = updatedJob.person;
            tasks[jobIndex].last_done = updatedJob.last_done;

            // Redistribute jobs to reflect changes
            distributeJobs(tasks);
        })
        .catch(error => {
            console.error('Error updating job:', error);
        });

        
    }
});

// Fireworks animation function
function triggerFireworks() {
    // Canvas Confetti - Simple Firework Explosion
    confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 }
    });
}

function formatDateTime(date) {
    const pad = (num) => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}