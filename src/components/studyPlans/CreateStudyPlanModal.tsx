import Modal from "@/ui/Modal";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"




export default function CreateStudyPlanModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Создать учебный план" size="lg">
ds
            </Modal>
        </>
    )
}