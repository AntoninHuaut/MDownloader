const formToJSON = elements => [].reduce.call(elements, (data, element) => {
    data[element.name] = element.value;
    return data;
}, {});

function submitForm(form, url) {
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);

    const opt = {
        timeOut: 2000
    };

    const postData = {
        linkList: []
    };

    for (let el of form.elements)
        if (el.name.includes('linkList[]')) postData.linkList.push(el.value);

    fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(res => res.json())
        .then(res => {
            let msg = res.msg.replace(/\n/g, '<br/>');

            if (res.code === 200)
                toastr.success(msg, "Success", opt);
            else
                toastr.error(msg, "Error", opt);

            setTimeout(() => {
                if (res.code === 200)
                    window.location.replace('/');
                else
                    document.querySelectorAll('button').forEach(btn => btn.disabled = false);
            }, opt.timeOut);
        });

    return false;
}