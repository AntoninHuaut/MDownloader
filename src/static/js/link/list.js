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
            .then(res => resolve(res.code === 200));
    });
}