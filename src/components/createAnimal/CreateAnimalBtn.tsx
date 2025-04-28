"use client";
import React, { useState } from 'react'
import { CirclePlus } from "lucide-react";
import CreateAnimalModal from './CreateAnimalModal';

export default function CreateAnimalBtn() {
    const [open, setOpen] = useState(false);

    const handleOpenModal = () => {
        setOpen((o) => !o)
    }
    return (
        <>
            <div>
                <button onClick={handleOpenModal}>
                    <CirclePlus className="fixed w-14 h-14 right-2 bottom-2" />
                </button>
                <CreateAnimalModal open={open} setOpen={setOpen} />
            </div>
        </>
    )
}
