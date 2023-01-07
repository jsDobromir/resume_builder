
export default class FinalizeView {

    constructor(state, evEmitter, routerObj) {
        this.state = state;
        this.evEmitter = evEmitter;
        this.routerObj = routerObj;
        this.multiRouteComp = false;
        this.title = 'finalize';
    }


    render() {
        const html = `<div class="finalize">
                        <div class="message_screen">
                            <p class="finalize_message">
                                Your CV is ready to be downloaded
                            </p>

                            <button class="btn btn-next" id="download">Download</button>
                        </div>
                        <div class="loader_wrapper d-none">
                            <div class="loader"></div>
                            <p>Your download will begin shortly</p>
                        </div>
                        
                      </div>`;

        return html;
    }

    attachEventListeners() {
        document.querySelector('#download').addEventListener('click', (event) => {
            const current_cv_id = document.querySelector('.wrapper').dataset.cvId;
            document.querySelector('.finalize .message_screen').classList.add('d-none');
            document.querySelector('.finalize .loader_wrapper').classList.remove('d-none');
            fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({current_cv_id: current_cv_id})
            })
            .then(response => {
                if (response.status!==200) {
                    //error
                    document.querySelector('.finalize .message_screen').classList.remove('d-none');
                    document.querySelector('.finalize .loader_wrapper').classList.add('d-none');
                    const alert_toast = document.querySelector(`.alert_toast`);
                    alert_toast.textContent = `Error downloading your file, please try again!`;
                    alert_toast.style.display = 'flex';
                    setTimeout(() => {
                        alert_toast.textContent = '';
                        alert_toast.style.display = 'none';
                    }, 5000);
                    return;
                }
                
                response.blob().then(blob => {
                    document.querySelector('.finalize .message_screen').classList.remove('d-none');
                    document.querySelector('.finalize .loader_wrapper').classList.add('d-none');
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = `cv_${new Date().toJSON().slice(0, 10)}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    setTimeout(() => {
                        window.location.href = '/resumes';
                    }, 2000)
                })
            }).catch(err => {
                document.querySelector('.finalize .message_screen').classList.remove('d-none');
                document.querySelector('.finalize .loader_wrapper').classList.add('d-none');
                const alert_toast = document.querySelector(`.alert_toast`);
                alert_toast.textContent = `Error downloading your file, please try again!`;
                alert_toast.style.display = 'flex';
                setTimeout(() => {
                    alert_toast.textContent = '';
                    alert_toast.style.display = 'none';
                }, 5000);
                return;
            });
        });
    }
}