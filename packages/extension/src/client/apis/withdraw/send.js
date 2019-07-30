import aztec from 'aztec.js';
import devUtils from '@aztec/dev-utils';
import asyncForEach from '~utils/asyncForEach';
import {
    addAccess,
} from '~utils/metadata';
import encryptedViewingKey from '~utils/encryptedViewingKey';
import Web3Service from '~client/services/Web3Service';
import ContractError from '~client/utils/ContractError';

const { JOIN_SPLIT_PROOF } = devUtils.proofs;

export default async function sendWithdraw({
    proof,
    options: {
        assetAddress,
    },
    data: {
        inputNotesOwner,
        outputNotes,
        outputNotesOwner,
    },
}) {
    try {
        const transferData = proof.encodeABI(assetAddress);
        await Web3Service
            .useContract('ACE')
            .method('validateProof')
            .send(
                JOIN_SPLIT_PROOF,
                inputNotesOwner.address,
                transferData,
            );
    } catch (error) {
        throw new ContractError('ace.validateProof', {
            type: 'JOIN_SPLIT',
            error,
        });
    }

    try {
        await Web3Service
            .useContract('ZkAsset')
            .at(assetAddress)
            .method('confidentialTransferFrom')
            .send(
                JOIN_SPLIT_PROOF,
                proof.eth.output,
            );
    } catch (error) {
        throw new ContractError('zkAsset.confidentialTransferFrom', {
            error,
        });
    }

    try {
        const {
            outputCoder,
        } = aztec.encoder;
        const outputNoteHashes = outputCoder.getOutputNotes(proof.output);

        await asyncForEach(outputNotes, async (note, i) => {
            const {
                noteHash,
                owner,
            } = note.exportNote();
            const realViewingKey = note.getView();
            const outputNote = outputCoder.getNote(outputNoteHashes, i);
            const metadata = outputCoder.getMetadata(outputNote);
            const {
                address,
                linkedPublicKey,
            } = owner === outputNotesOwner.address
                ? outputNotesOwner
                : inputNotesOwner;
            const viewingKey = encryptedViewingKey(linkedPublicKey, realViewingKey);
            const newMetadata = addAccess(metadata, {
                address,
                viewingKey: viewingKey.toHexString(),
            });

            try {
                await Web3Service
                    .useContract('ZkAsset')
                    .at(assetAddress)
                    .method('updateNoteMetaData')
                    .send(
                        noteHash,
                        newMetadata,
                    );
            } catch (error) {
                throw new ContractError('zkAsset.updateNoteMetaData', {
                    note,
                });
            }
        });
    } catch (error) {
        throw new ContractError('note.shareAccess', {
            error,
        });
    }

    return outputNotes;
}
