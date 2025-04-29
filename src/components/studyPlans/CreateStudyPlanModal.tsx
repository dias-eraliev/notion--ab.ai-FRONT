import Modal from "@/ui/Modal";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { TextField, SubmitButton } from "@/ui/forForms";
import { createStudyPlan } from "@/api/studyPlans";
import { useTeachers } from "@/api/teachers.api";
import { useGroups } from "@/api/groups.api";
import Select from "react-tailwindcss-select"

const { fieldContext, formContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
        Select
    },
    formComponents: {
        SubmitButton
    },
    fieldContext,
    formContext,
})

export default function CreateStudyPlanModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    // Всегда вызываем хуки вне условий
    const { teachers, isError: teachersError, isLoading: isTeachersLoading } = useTeachers()
    const { groups, isError: groupsError, isLoading: isGroupsLoading } = useGroups()

    const form = useAppForm({
        defaultValues: {
            name: "",
            groupIds: [{
                value: groups?.[0].id.toString(),
                label: groups?.[0].name,
            }],
            teacherId: {
                value: teachers?.[0].id.toString(),
                label: `${teachers?.[0].surname} ${teachers?.[0].name}`,
            },
            description: "",
            courseNumber: 1,
        },
        // validators: {
        //     onChange: z.object({
        //         name: z.string().min(1, { message: "Name is required" }),
        //         groupIds: z.array(z.number()).min(1, { message: "At least one group is required" }),
        //         teacherId: z.number().min(1, { message: "Teacher is required" }),
        //         description: z.string().min(1, { message: "Description is required" }),
        //         courseNumber: z.number().min(1, { message: "Course number is required" }),
        //     }),
        // },
        onSubmit: async ({ value }) => {
            const { name, groupIds, teacherId, description, courseNumber } = value
            const data = await createStudyPlan({ name, description, courseNumber }, groupIds.map(group => (Number(group.value))), parseInt(teacherId.value))
            console.log(data)
            onClose()
        },
    })

    const error = groupsError || teachersError
    const isLoading = isGroupsLoading || isTeachersLoading

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Создать учебный план" size="lg">
                {error ? (
                    <div>Ошибка загрузки данных</div>
                ) : isLoading ? (
                    <div>Загрузка...</div>
                ) : (
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}>
                        <form.AppField name="name" children={(field) => <field.TextField className=" input input-bordered" onChange={(e) => field.handleChange(e.currentTarget.value)} />}></form.AppField>
                        <form.AppField name="description" children={(field) => <field.TextField onChange={(e) => field.handleChange(e.currentTarget.value)} />}></form.AppField>
                        <form.AppField name="courseNumber" children={(field) => <field.TextField onChange={(e) => field.handleChange(e.currentTarget.valueAsNumber)} />}></form.AppField>
                        <form.AppField name="groupIds" children={field => (
                            <field.Select
                                primaryColor="green"
                                isMultiple
                                value={field.state.value}
                                onChange={field.handleChange}
                                options={groups!.map(group => ({
                                    value: group.id.toString(),
                                    label: group.name
                                }))}
                            />
                        )} />
                        <form.AppField name="teacherId" children={field => (
                            <field.Select
                                primaryColor="green"
                                isMultiple={false}
                                value={field.state.value}
                                onChange={field.handleChange}
                                options={teachers!.map(teacher => ({
                                    value: teacher.id.toString(),
                                    label: `${teacher.surname} ${teacher.name}`
                                }))}
                            />
                        )} />
                        <form.AppForm>
                            <form.SubmitButton />
                        </form.AppForm>
                    </form>
                )}
            </Modal >
        </>
    )
}