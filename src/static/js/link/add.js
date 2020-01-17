document.addEventListener("DOMContentLoaded", createLinkDiv);

function createLinkDiv() {
    const linkParent = document.getElementById('linkParent');

    const divParent = document.createElement('div');
    divParent.classList.add('form-group', 'row', 'link');

    const label = document.createElement('label');
    label.classList.add('col-2', 'col-form-label');
    setTextLabel(label, getCountLink() + 1);

    const div = document.createElement('div');
    div.classList.add('col-10');

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.name = "linkList[]";
    setIdInput(input, getCountLink() + 1);
    input.oninput = () => {
        updateInput(input);
    };

    div.append(input);

    divParent.append(label);
    divParent.append(div);

    linkParent.append(divParent);
}

function updateInput(input) {
    let idSplit = input.id.split('-');
    if (idSplit.length < 2);

    const id = Number.parseInt(idSplit[1], 10);
    if (Number.isNaN(id)) return;

    const text = input.value;

    if (text) {
        const linkList = getLinkList();
        if (linkList.length <= id) createLinkDiv();
    } else {
        const linkList = getLinkList();
        if (!linkList.length || linkList.length == 1 || linkList.length < id) return;

        const linkDiv = linkList[id - 1];
        linkDiv.parentElement.removeChild(linkDiv);

        refreshId(id);
    }
}

function refreshId(idDelete) {
    const linkList = document.querySelectorAll('.link');
    if (!linkList.length || linkList.length < idDelete) return;

    for (let i = idDelete - 1; i < linkList.length; i++) {
        const link = linkList[i];
        const label = link.querySelector('label');
        const input = link.querySelector('input');

        setTextLabel(label, i + 1);
        setIdInput(input, i + 1);
    }
}

function setTextLabel(label, id) {
    label.innerText = `Link ${id}`;
}

function setIdInput(input, id) {
    input.id = `link-${id}`;
}

function getLinkList() {
    return document.querySelectorAll('.link');
}

function getCountLink() {
    return getLinkList().length;
}