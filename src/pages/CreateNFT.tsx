import React, { useState } from "react";
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
// import { Signer } from "ethers";
// import { useSigner, useSwitchNetwork } from "wagmi";
import { NextPage } from "next";
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

import { useCounter } from "usehooks-ts";

const CreateNFT: NextPage = () => {
    const [formData, setFormData] = useState<ICreateNFT>({
        name: "",
        description: "",
        file: {},
        symbol: "",
        contractAddress: "",
        ipfsAddress: "",
        blockchain: "",
    });

    const confirmDialog = useDialogState();
    const { count: activeStep, increment: incrementActiveStep, reset: resetActiveStep } = useCounter(0);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateForm(formData, ["ipfsAddress", "contractAddress", "price"])) {
            return;
        }

        resetActiveStep();

        // SHOW DIALOG
        confirmDialog.toggle();

        try {
            const path = await storeNFT(formData.file as File);
            console.log("path " + path);
            handleChangeBasic(path, setFormData, "ipfsAddress");

            // const contract = await deployNFTContract(signerData as Signer, {
            //     name: formData.name,
            //     symbol: formData.symbol,
            //     baseURI: path,
            //     price: formData.price ? formData.price.toString() : "0",
            //     layerzeroEndpoint: endpoint,
            //     //todo: need to calculate when few blockchains
            //     startMintId: 0,
            //     endMintId: calculateSupply(),
            // });
            incrementActiveStep();

            incrementActiveStep();
            incrementActiveStep();
            // handleChangeBasic(contract.address, setFormData, "contractAddress");
        } catch (error) {
            handleContractError(error, { dialog: confirmDialog });
            resetActiveStep();
        }
    }

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
                                <div className="grid grid-cols-2 gap-10">
                                    <InputText
                                        label="Symbol"
                                        name="symbol"
                                        placeholder="Short NFT name"
                                        className={"max-w-sm"}
                                        handleChange={(event) => {
                                            handleTextChange(event, setFormData);
                                        }}
                                        // className="w-1/2"
                                    />
                                </div>
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
                        <div className="grid w-full grid-cols-3 gap-4">
                            {/* <InputSupplyOfNFT
                                key={chain}
                                label={chain}
                                name={chain}
                                image={getLogoURI(chain)}
                                handleChange={(event) => {
                                    handleNftSupplyChange(event, setFormData, chain, "blockchain");
                                }}
                                isDisabled={chain !== formData.blockchain && formData.blockchain !== ""}
                            /> */}
                        </div>
                        <Button className="mt-5 w-2/3 self-center">Create Contract</Button>
                    </form>
                </section>

                <CreateNftDialog formData={formData} activeStep={activeStep} dialog={confirmDialog} />
            </Layout>
        </div>
    );
};

export default CreateNFT;
