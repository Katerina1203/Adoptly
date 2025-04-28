"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
    setVisible: (visible: boolean) => void
}

function PasswordVisibleToggle({ setVisible }: Props) {
    const [isVisible, setIsVisible] = React.useState(false);

    const handleToggle = () => {
        setIsVisible((prev) => !prev);
        setVisible(!isVisible);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleToggle}>
                    {isVisible ? (
                        <EyeOff className="h-[1.2rem] w-[1.2rem] transition-all" />
                    ) : (
                        <Eye className="h-[1.2rem] w-[1.2rem] transition-all" />
                    )}
                    <span className="sr-only">Toggle password</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setVisible(true)}>
                    Visible
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisible(false)}>
                    Hidden
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default PasswordVisibleToggle;
