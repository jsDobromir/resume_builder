document.addEventListener("DOMContentLoaded", (ev) => {
    
    document.querySelectorAll('.btn-text-delete-resume').forEach(deleteLink => {
        deleteLink.addEventListener('click', (linkEv) => {
            linkEv.preventDefault();
            let splitted = linkEv.target.href.split('/');
            let id = splitted[splitted.length-1];
            if (window.confirm('Do you want to delete this Resume?')) {
                fetch(`/deleteResume/${id}`, {
                    method: 'DELETE'
                }).then(res => res.json())
                  .then(res => {
                        if (res.success) {
                            window.location.href = '/resumes';
                        }
                        return;
                  })
            }
            else {
                return;
            }
        })
    });
});