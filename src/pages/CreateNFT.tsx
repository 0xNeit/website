import React, { useState, useCallback } from "react";
import Layout, {
    BackButton,
    Button,
    CreateNftDialog,
    DragAndDropImage,
    InputAmount,
    InputSupplyOfNFT,
    InputText,
    InputTextArea,
} from "components";
import { NextPage } from "next";
import { JsonRpcProvider, Network } from "@mysten/sui.js";
import { ICreateNFT } from "types";
import {
    handleChangeBasic,
    handleContractError,
    handleImageChange,
    handleNftSupplyChange,
    handleTextChange,
    storeNFT,
    validateForm,
} from "utils";
import { useDialogState } from "ariakit";
import { ethos } from "ethos-connect";

import { useCounter } from "usehooks-ts";
import ASSETS from "assets";

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<ICreateNFT>({
        name: "",
        description: "",
        file: {},
        symbol: "",
        contractAddress: "",
        ipfsAddress: "",
        numberOfNFT: null,
    });

    const contractLoyaltyAddress = "0x19b6899300823149a5f4916d6ec00418f91f4302";
    // connect to local RPC server
    const provider = new JsonRpcProvider(Network.DEVNET);
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState(null);
    const [collectionName, setCollectionName] = useState(null);

    const confirmDialog = useDialogState();
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    const createCollection = useCallback(
        async (name: String, desciprtion: String, urlLink: String, maxSupply: Number) => {
            if (!wallet) return;

            try {
                const signableTransaction = {
                    kind: "moveCall" as const,
                    data: {
                        packageObjectId: contractLoyaltyAddress,
                        module: "loyalty_nft",
                        function: "create_loyalty_system",
                        typeArguments: [],
                        arguments: [name, desciprtion, urlLink, maxSupply],
                        gasBudget: 10000,
                    },
                };

                const response = await wallet.signAndExecuteTransaction(signableTransaction);
                //setNftObjectId(response.effects.created[1].reference.objectId);
                if (response?.effects?.events) {
                    const { moveEvent } = response.effects.events.find((e) => e.moveEvent);
                    setNftObjectId(moveEvent.fields.object_id);
                    handleChangeBasic(moveEvent.fields.object_id, setFormData, "contractAddress");
                    return moveEvent.fields.object_id;
                }
                return "";
            } catch (error) {
                console.log(error);
            }
        },
        [wallet]
    );

    const mintButton = useCallback(
        async (collectionObjectID: String) => {
            if (!wallet) return;

            try {
                const signableTransaction = {
                    kind: "moveCall" as const,
                    data: {
                        packageObjectId: contractLoyaltyAddress,
                        module: "loyalty_nft",
                        function: "mint",
                        typeArguments: [],
                        arguments: [collectionObjectID],
                        gasBudget: 10000,
                    },
                };

                const response = await wallet.signAndExecuteTransaction(signableTransaction);
                console.log(response);

                if (response?.effects?.events) {
                    const { newObject } = response.effects.events.find((e) => e.newObject);
                    console.log("Object NFT", newObject.objectId);
                }
            } catch (error) {
                console.log(error);
            }
        },
        [wallet]
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["ipfsAddress", "contractAddress"])) {
            return;
        }

        resetActiveStep();

        // SHOW DIALOG
        confirmDialog.toggle();

        try {
            const path = await storeNFT(formData.file as File);
            console.log("path " + path);
            handleChangeBasic(path, setFormData, "ipfsAddress");
            console.log(formData.name, formData.description, path, formData.numberOfNFT);
            incrementActiveStep();
            const objectID = await createCollection(formData.name, formData.description, path, formData.numberOfNFT);
            console.log("OBJECT ID", objectID);
            incrementActiveStep();

            const tx = await provider.getObject(String(objectID));
            setCollectionName(tx.details!.data.fields.name);
            incrementActiveStep();
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            resetActiveStep();
        }
    }

    const chain = "1";

    return (
        <div>
            <Layout className="layout-base">
                <section className="relative w-full">
                    <form className="mx-auto flex max-w-4xl flex-col gap-4" onSubmit={onSubmit}>
                        <h1 className="text-highlighter">Add NFT</h1>
                        <div className={"grid grid-cols-2"}>
                            <div className={"grid grid-flow-row"}>
                                <InputText
                                    label="Name"
                                    name="name"
                                    className={"max-w-2xl"}
                                    placeholder="NFT Name"
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <InputTextArea
                                    label="Description"
                                    name="description"
                                    className={"max-w-2xl"}
                                    placeholder="A short description about NFT collection(Max. 250 words)"
                                    maxLength={2000}
                                    handleChange={(event) => handleTextChange(event, setFormData)}
                                />
                                <InputText
                                    label="Symbol"
                                    name="symbol"
                                    placeholder="Short NFT name"
                                    className={"w-full"}
                                    handleChange={(event) => {
                                        handleTextChange(event, setFormData);
                                    }}
                                />
                            </div>
                            <div className={"flex"}>
                                <div className="divider divider-horizontal" />
                                <DragAndDropImage
                                    height={"h-full"}
                                    label="Image"
                                    name="file"
                                    handleChange={(file) => handleImageChange(file, setFormData, "file")}
                                />
                            </div>
                        </div>

                        <label className="label">
                            <span className="input-label">NFT Supply</span>
                        </label>
                        <div className="w-full">
                            <InputSupplyOfNFT
                                key={chain}
                                label={chain}
                                name="numberOfNFT"
                                image={ASSETS.defaultToken}
                                handleChange={(event) => {
                                    handleTextChange(event, setFormData);
                                }}
                            />
                        </div>
                        <Button className="mt-5 w-2/3 self-center">Create Contract</Button>
                        <div>NFT Object ID: {nftObjectId}</div>
                        <div>Collection Name: {collectionName}</div>
                    </form>
                </section>
                <Button
                    className="mt-5 w-2/3 bg-purple-500 self-center"
                    type="button"
                    onClick={() => mintButton(nftObjectId)}
                >
                    Mint Button
                </Button>

                <CreateNftDialog formData={formData} activeStep={activeStep} dialog={confirmDialog} />
            </Layout>
        </div>
    );
};

export default CreateNFT;
