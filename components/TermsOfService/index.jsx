import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function TermOfService({
    userAgreement,
    setUserAgreement
}) {
    const [open, setOpen] = React.useState(userAgreement === false)
    const onOpenChange = (e) => {
        setUserAgreement(true)
        setOpen(e)
        console.log('User agreed to terms of service', e)

        // set the user agreement to true localsotrage
        localStorage.setItem('userAgreement', true)
    }
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Agree to Our Terms of Service
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Please read our terms of service before proceeding with using our service. <br />
                        click <a className="text-cyan-600" href="https://chapimenge.com/terms-of-service" target="_blank" rel="noreferrer">Read our terms of service</a>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
