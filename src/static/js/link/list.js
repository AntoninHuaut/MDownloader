function download(videoId) {
    action("/link/download", videoId);
}

function remove(videoId) {
    action("/link/remove", videoId)
        .then(res => {
            if (!res) return;

            window.location.reload();
        });
}

function saveFormat() {
    const formatSelect = document.getElementById('formatSelect');
    const value = formatSelect.value;

    const opt = {
        timeOut: 1000
    };

    fetch('/format/select', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                format: value
            })
        })
        .then(res => res.json())
        .then(res => {
            let msg = res.msg.replace(/\n/g, '<br/>');

            if (res.code === 200)
                toastr.success(msg, "Success", opt);
            else
                toastr.error(msg, "Error", opt);
        });
}

function action(url, videoId) {
    return new Promise(resolve => {
        fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    videoId: videoId
                })
            })
            .then(res => res.json())
            .then(res => resolve(res.code === 200));
    });
}