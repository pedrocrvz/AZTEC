import apis from '~uiModules/apis';

const stepApprove = {
    name: 'approve',
    blockStyle: 'linked',
    descriptionKey: 'withdraw.approve.description',
    tasks: [
        {
            run: apis.proof.withdraw,
        },
    ],
    submitTextKey: 'withdraw.approve.submit',
};

const stepSignNotes = {
    name: 'signNotes',
    blockStyle: 'collapsed',
    descriptionKey: 'withdraw.sign.description',
    tasks: [
        {
            type: 'sign',
            run: apis.note.signNotes,
        },
    ],
    autoStart: true,
    submitTextKey: 'transaction.sign.submit',
};

const stepSignNotesForGSN = {
    ...stepSignNotes,
    tasks: [
        {
            type: 'sign',
            run: apis.note.signProof,
        },
    ],
};

const stepConfirm = {
    name: 'confirm',
    blockStyle: 'collapsed',
    descriptionKey: 'withdraw.confirm.description',
    tasks: [],
    submitTextKey: 'transaction.send.submit',
};

const stepConfirmViaGSN = {
    ...stepConfirm,
    descriptionKey: 'transaction.gsn.send.description',
};

const stepSend = {
    name: 'send',
    blockStyle: 'sealed',
    descriptionKey: 'withdraw.send.description',
    tasks: [
        {
            titleKey: 'transaction.step.create.proof',
            run: apis.mock,
        },
        {
            titleKey: 'transaction.step.sign',
            run: apis.mock,
        },
        {
            titleKey: 'withdraw.send.step',
            type: 'sign',
            run: apis.asset.confidentialTransfer,
        },
        {
            titleKey: 'transaction.confirmed',
        },
    ],
    showTaskList: true,
    autoStart: true,
    submitTextKey: 'transaction.send.submit',
};

const stepSendViaGSN = {
    name: 'send',
    blockStyle: 'sealed',
    descriptionKey: 'transaction.gsn.send.description',
    tasks: [
        {
            titleKey: 'transaction.step.create.proof',
            run: apis.mock,
        },
        {
            titleKey: 'transaction.step.sign',
            run: apis.mock,
        },
        {
            titleKey: 'transaction.step.relay',
            run: apis.asset.confidentialTransferFrom,
        },
        {
            titleKey: 'transaction.confirmed',
        },
    ],
    showTaskList: true,
    autoStart: true,
    submitTextKey: 'transaction.send.submit',
};

export default {
    gsn: [
        stepApprove,
        stepSignNotesForGSN,
        stepConfirmViaGSN,
        stepSendViaGSN,
    ],
    metamask: [
        stepApprove,
        stepSignNotes,
        stepConfirm,
        stepSend,
    ],
};
