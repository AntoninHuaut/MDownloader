function download(videoId) {}

function remove(videoId) {
    action("/link/remove", videoId)
        .then(res => {
            if (!res) return;

            window.location.reload();
        });
}

function action(url, videoId) {
    return new Promise(resolve => {
        const opt = {
            timeOut: 1000
        };

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
            .then(res => {
                let msg = res.msg.replace(/\n/g, '<br/>');

                if (res.code === 200)
                    toastr.success(msg, "Success", opt);
                else
                    toastr.error(msg, "Error", opt);

                resolve(res.code === 200);
            });
    });
}