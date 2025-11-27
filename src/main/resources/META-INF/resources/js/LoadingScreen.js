let line1Completed = 0;

document.addEventListener("DOMContentLoaded", function () {
    prefillLoadedQuantities();
});

function prefillLoadedQuantities() {
    let loadingItemsJson = document.getElementById("hdnloadingItems").value;
    
    if (loadingItemsJson) {
        let loadingItems = JSON.parse(loadingItemsJson);

        loadingItems.forEach(item => {
            let buttonContainer = document.querySelector(`.custom-button-container input[value="${item.item_id}"]`)?.closest('.custom-button-container');

            if (buttonContainer) {
                let pendingQtyElement = buttonContainer.querySelector('.pending-qty');
                let loadedQtyElement = buttonContainer.querySelector('.loaded-qty');                
                let currentLineQtyButton = buttonContainer.querySelector('.currentlineqty');
                let buttonBox = buttonContainer.querySelector('.custom-button');

                let pendingQty = parseFloat(pendingQtyElement.textContent) - item.loaded_qty;
                let loadedQty = item.loaded_qty;

                pendingQtyElement.textContent = pendingQty;
                loadedQtyElement.textContent = loadedQty;
                currentLineQtyButton.textContent = '0'; // Reset for new line session

                updateButtonColor(buttonBox, pendingQty);
            }
        });
        updateFooter();
    }
}

function updateFooter() {
    let totalLoaded = 0;
    let totalItems = 0;

    document.querySelectorAll('.custom-button').forEach(button => {
        let buttonText = button.querySelector('.button-content').textContent.trim();
        let qty = buttonText.split('-')[0].trim(); 
        totalItems += Number(qty);
    });

    document.querySelectorAll('.loaded-qty').forEach(el => {
        totalLoaded += parseFloat(el.textContent);
    });

    document.getElementById('total-loaded').textContent = totalLoaded.toFixed(0);
    document.getElementById('total-items').textContent = totalItems.toFixed(0);

    // 🔽 Get current line's qty using all visible .currentlineqty buttons
    let currentLineQty = 0;
    document.querySelectorAll('.currentlineqty').forEach(btn => {
        currentLineQty += parseFloat(btn.textContent || "0");
    });

    // Update button with only current line loaded qty
    const lineNo = document.getElementById("hdnlineno").value;
    const completeBtn = document.getElementById("complete-line");
    completeBtn.textContent = `(${currentLineQty}) Complete Line ${lineNo} `;
}


function updateQuantities(button, maxQty) {
    const pendingQtyElement = button.querySelector('.pending-qty');
    const loadedQtyElement = button.querySelector('.loaded-qty');
    const minusButton = button.closest('.custom-button-container').querySelector('.minus-button');
    const currentLineQtyButton = button.closest('.custom-button-container').querySelector('.currentlineqty');
    const buttonContainer = button.closest('.custom-button');

    let pendingQty = parseFloat(pendingQtyElement.textContent);
    let loadedQty = parseFloat(loadedQtyElement.textContent);
    let currentLineQty = parseFloat(currentLineQtyButton.textContent);

    pendingQty -= 1;
    loadedQty += 1;
    currentLineQty += 1; // Increment from 0, independent of loadedQty

    pendingQtyElement.textContent = pendingQty.toFixed(0);
    loadedQtyElement.textContent = loadedQty.toFixed(0);
    currentLineQtyButton.textContent = currentLineQty.toFixed(0);

    if (loadedQty > 0) {
        minusButton.style.display = 'block';
        currentLineQtyButton.style.display = 'block';
    }

    updateButtonColor(buttonContainer, pendingQty);
    updateFooter();
}

function decrementQuantities(minusButton) {
    const buttonContainer = minusButton.closest('.custom-button-container');
    const button = buttonContainer.querySelector('.custom-button');
    const pendingQtyElement = button.querySelector('.pending-qty');
    const loadedQtyElement = button.querySelector('.loaded-qty');
    const currentLineQtyButton = buttonContainer.querySelector('.currentlineqty');
    
    let pendingQty = parseFloat(pendingQtyElement.textContent);
    let loadedQty = parseFloat(loadedQtyElement.textContent);
    let currentLineQty = parseFloat(currentLineQtyButton.textContent);

    if (loadedQty > 0 && currentLineQty > 0) {
        loadedQty -= 1;
        pendingQty += 1;
        currentLineQty -= 1;

        pendingQtyElement.textContent = pendingQty.toFixed(0);
        loadedQtyElement.textContent = loadedQty.toFixed(0);
        currentLineQtyButton.textContent = currentLineQty.toFixed(0);

        if (currentLineQty === 0) {
            minusButton.style.display = 'none';
            currentLineQtyButton.style.display = 'none';
        }

        updateButtonColor(button, pendingQty);
    } else {
        alert("No loaded items to unload.");
    }

    updateFooter();
}

function updateButtonColor(button, pendingQty) {
    if (pendingQty === 0) {
        button.classList.remove('white', 'pink');
        button.classList.add('green');
        navigator.vibrate(500);
    } else if (pendingQty < 0) {
        button.classList.remove('white', 'green');
        button.classList.add('pink');
    } else {
        button.classList.remove('green', 'pink');
        button.classList.add('white');
    }
}

function showModalPopup(loadingId,orderId) {

    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'modalOverlay';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '1000';

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modalContainer';
    modalContainer.style.backgroundColor = '#fff';
    modalContainer.style.borderRadius = '10px';
    modalContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContainer.style.padding = '20px';
    modalContainer.style.width = '90%';
    modalContainer.style.maxWidth = '600px';
    modalContainer.style.textAlign = 'center';

    // Modal title
    const modalText = document.createElement('p');
    modalText.textContent = 'Previously Filled Lines:';
    modalText.style.marginBottom = '20px';
    modalText.style.fontSize = '16px';
    modalText.style.color = '#333';

    // Previous Lines Section
    const previousLinesDiv = document.createElement('div');
    previousLinesDiv.id = 'previousLinesDiv';
    previousLinesDiv.style.marginBottom = '20px';
    previousLinesDiv.innerHTML = '<strong>Loading...</strong>';
    fetchPreviousLines(orderId,loadingId, previousLinesDiv);

    // "Complete Loading" button
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete Loading';
    completeButton.className = 'modal-button';
    completeButton.style.marginRight = '10px';
    completeButton.onclick = () => {
        fetch('?a=completeLoading', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'loading_id=' + encodeURIComponent(loadingId)
        })
        .then(response => response.text()) // changed from .json()
        .then(data => {
            alert(data || 'Loading Completed Successfully');
            closeModal();
            window.location='?a=showHomePage';
        })
        .catch(error => {
            console.error('AJAX Error:', error);
            alert('Something went wrong.');
        });
    };

    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'modal-button';
    closeButton.onclick = () => closeModal();

    // Append elements
    modalContainer.appendChild(modalText);
    modalContainer.appendChild(previousLinesDiv);
    modalContainer.appendChild(completeButton);
    modalContainer.appendChild(closeButton);
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);
}




function fetchPreviousLines(orderId, loadingId, previousLinesDiv) {
    // Send AJAX request to fetch distinct lines
    fetch(`?a=getDistinctLineNumbers&loading_id=${loadingId}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                previousLinesDiv.innerHTML = ''; // Clear previous content

                data.forEach(line => {
                    const lineDiv = document.createElement('div');
                    lineDiv.style = "margin:10px; cursor:pointer; display: flex; align-items: center; gap: 10px;";
                    
                    // Set text and image with proper click separation
                    lineDiv.innerHTML = `
                        <span>Line ${line.line_no}</span>
                        <img 
                            onclick="event.stopPropagation(); getVisitorImage(${line.attachment_id})" 
                            src="BufferedImagesFolder/dummyImage.jpg" 
                            height="30" width="30" 
                            style="cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">
                    `;

                    // Set click handler for opening edit modal
                    lineDiv.onclick = () => openEditModal(orderId, loadingId, line.line_no);
                    previousLinesDiv.appendChild(lineDiv);
                });
            } else {
                previousLinesDiv.innerHTML = '<strong>No previous lines found.</strong>';
            }
        })
        .catch(error => {
            console.error('Error fetching previous lines:', error);
        });
}

function showLineDetails(loading_id, lineNo) {
    fetch("?a=getLineDetails&loading_id=" + loading_id + "&line_no=" + lineNo)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Keep this as requested

            //const parsedData = JSON.parse(data);
            const modalContainer = document.getElementById('modalContainer');
            modalContainer.innerHTML = ""; // Clear existing content

        

            // Create the table
            let tableHTML = `
                <table border="1" style="width:100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr>
                            <th>Line No</th>
                            <th>Item Name</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.forEach(d1 => {
                tableHTML += `
                    <tr>
                        <td>`+d1.line_no+`</td>
                        <td>`+d1.item_name+`</td>
                        <td>`+d1.current_line_qty+`</td>                        
                    </tr>
                `;
            });

            

            tableHTML += `
                    </tbody>
                </table>
            `;

            // Close button
           
            
            const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'modal-button';
    closeButton.onclick = () => closeModal();

            // Inject into modal

            modalContainer.innerHTML = tableHTML;
            modalContainer.appendChild(closeButton);
        })
        .catch(error => {
            console.error('Error fetching line details:', error);
        });
}


function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        document.body.removeChild(modalOverlay);
    }
}
function completeLine() {
    let itemsData = [];
    let lineNo = document.getElementById("hdnlineno").value;
    let orderId = document.getElementById("hdnorderid").value;
    let loadingId = document.getElementById("hdnloadingid").value;

    document.querySelectorAll('.custom-button-container').forEach(container => {
        let button = container.querySelector('.custom-button');
        let itemId = button.querySelector('input[type="hidden"]').value;
        let pendingQty = parseFloat(button.querySelector('.pending-qty').textContent);
        let loadedQty = parseFloat(button.querySelector('.loaded-qty').textContent);
        let currentLineQty = parseFloat(container.querySelector('.currentlineqty').textContent);

        itemsData.push({
            loading_id: loadingId,
            line_no: lineNo,
            order_id: orderId,
            item_id: itemId,
            pending_qty: pendingQty,
            loaded_qty: loadedQty,
            current_line_qty: currentLineQty
        });
    });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "?a=completeLine", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //alert(xhr.responseText);
            if (xhr.status === 200) {
                openCameraModal();
                //window.location = `?a=showLoadingScreen&loading_id=${loadingId}&order_id=${orderId}&line_no=${parseInt(lineNo) + 1}`;
            } else {
                alert("Error completing the line. Please try again.");
            }
        }
    };
    
    xhr.send(JSON.stringify({ items: itemsData }));
}


let videoStream;
let torchOn = false;

function openCameraModal() {
    document.getElementById("cameraModal").style.display = "flex";

    const constraints = {
        video: { facingMode: { exact: "environment" } } // Try back camera
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            videoStream = stream;
            document.getElementById("video").srcObject = stream;
        })
        .catch(error => {
            console.warn("Back camera not available, switching to front camera:", error);

            // Fallback to front camera
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
                .then(stream => {
                    videoStream = stream;
                    document.getElementById("video").srcObject = stream;
                })
                .catch(err => {
                    console.error("Error accessing front camera:", err);
                });
        });
}




function getVisitorImage(attachment_id)
{
	$.get("?a=getFileFromDbToBuffer&attachment_id="+attachment_id, function(data, status){
    window.open("BufferedImagesFolder/"+data);
  });
}





function openEditModal(orderId, loadingId, lineNo) {
    fetch(`?a=getLineDetails&loading_id=${loadingId}&line_no=${lineNo}`)
        .then(response => response.json())
        .then(data => {
            let html = `
                <div style="
                    text-align: center;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 20px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                ">
                    <h2 style="margin-bottom: 10px; color: #2c3e50;">
                        Editing Line No: <span style="color: #2980b9;">${lineNo}</span>
                    </h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 10px; border: 1px solid #ccc;">Item Name</th>
                                <th style="padding: 10px; border: 1px solid #ccc;">Loaded Qty</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.forEach(item => {
                html += `
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ccc;">${item.item_name}</td>
                        <td style="padding: 10px; border: 1px solid #ccc;">
                            <input 
                                type="number" 
                                data-item-id="${item.item_id}" 
                                value="${item.current_line_qty}" 
                                data-original-qty="${item.current_line_qty}" 
                                style="width: 80px; padding: 6px; font-size: 14px;"
                                min="0"
                            />
                        </td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                    <div style="text-align: center;">
                        <button onclick="saveEditedLine(${loadingId},${orderId}, ${lineNo})" style="padding: 10px 20px; background-color: #27ae60; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                             Save Changes
                        </button>
                        &nbsp;
                        <button onclick="closeModal()" style="padding: 10px 20px; background-color: #c0392b; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                             Cancel
                        </button>
                    </div>
                </div>
            `;

            const modalContainer = document.getElementById('modalContainer');
            modalContainer.innerHTML = html;
            modalContainer.style.display = 'block';

            // Optional: Ensure parent has styling for fixed modal display
            modalContainer.style.position = 'fixed';
            modalContainer.style.top = '0';
            modalContainer.style.left = '0';
            modalContainer.style.width = '100%';
            modalContainer.style.height = '100%';
            modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modalContainer.style.display = 'flex';
            modalContainer.style.justifyContent = 'center';
            modalContainer.style.alignItems = 'center';
            modalContainer.style.zIndex = '1000';
        })
        .catch(err => {
            alert("Error loading line data");
            console.error(err);
        });
}


function saveEditedLine(loadingId, orderId, lineNo) {
    const inputs = document.querySelectorAll('#modalContainer input[type="number"]');
    const updatedItems = [];
    let alertMessage = 'Changes:\n';
    let hasChanges = false;

    inputs.forEach(input => {
        const originalQty = parseInt(input.dataset.originalQty);
        const newQty = parseInt(input.value);
        const diff = newQty - originalQty;

        updatedItems.push({
            item_id: input.dataset.itemId,
            loaded_qty: newQty,
            difference: diff  // include difference here
        });

        if (diff !== 0) {
            hasChanges = true;
            alertMessage += `Item ID ${input.dataset.itemId}: ${diff > 0 ? '+' : ''}${diff}\n`;
        }
    });

    if (hasChanges) {
        alert(alertMessage);
    } else {
        alert("No changes detected.");
    }

    fetch('?a=updateLineQuantities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            loading_id: loadingId,
            order_id: orderId,
            line_no: lineNo,
            items: updatedItems // now includes difference
        })
    })
    .then(response => response.text())
    .then(responseText => {
        closeModal();

        document.getElementById("hdnloadingid").value = loadingId;
        document.getElementById("hdnlineno").value = lineNo;

        openCameraModal();
    })
    .catch(error => {
        alert("Error updating line items.");
        console.error(error);
    });
}
let mediaStream = null;
let capturedImageData = null;

async function startCamera() {
    try {
        const constraints = {
            video: {
                width: 300,
                height: 600,
                facingMode: 'environment',
            },
            audio: false
        };

        const video = document.getElementById("video");

        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = mediaStream;
        video.play();
    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Camera access failed.");
    }
}

function stopCamera() {
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
        mediaStream = null;
    }
}

function takePhoto(actionType) {

    

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if(actionType=="Retake")
    {
        canvas.style.display = "none";
        video.style.display = "block";
        document.getElementById("btnTakePhoto").innerHTML = "Take Photo";        
    }
    else
    {
        canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.style.display = "block";
    video.style.display = "none";
    
    capturedImageData = canvas.toDataURL("image/png");

    // Enable Save button
    document.getElementById("btnSavePhoto").style.display = "inline-block";
    document.getElementById("btnTakePhoto").innerHTML = "Retake";
    }

    

    
        

    
}

function savePhoto() {
    if (!capturedImageData) {
        alert("Please take a photo first.");
        return;
    }

    fetch('?a=saveLinePhoto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            image: capturedImageData,
            order_id: orderId,
            loading_id: loadingId,
            line_no: document.getElementById("hdnlineno").value
        })
    })
    .then(response => response.text())
    .then(text => {
        window.location = text;
    })
    .catch(error => {
        console.error("Save photo failed:", error);
        alert("Error saving photo: " + error);
    });
}

// OPTIONAL: When closing the modal, call this
function closeCameraModal() {
    stopCamera();
    document.getElementById("cameraModal").style.display = "none";
    document.getElementById("btnSavePhoto").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    capturedImageData = null;
}
