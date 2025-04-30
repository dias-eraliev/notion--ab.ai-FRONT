import Modal from '@/ui/Modal';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { TextField, SubmitButton } from '@/ui/forForms';
import { createStudyPlan } from '@/api/studyPlans';
import { useTeachers } from '@/api/teachers.api';
import { useGroups } from '@/api/groups.api';
import Select from 'react-tailwindcss-select';

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
        Select,
    },
    formComponents: {
        SubmitButton,
    },
    fieldContext,
    formContext,
});

export default function CreateStudyPlanModal({
    isOpen,
    onClose,
    mutate
}: {
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}) {
    // Всегда вызываем хуки вне условий
    const {
        teachers,
        isError: teachersError,
        isLoading: isTeachersLoading,
    } = useTeachers();
    const {
        groups,
        isError: groupsError,
        isLoading: isGroupsLoading,
    } = useGroups();

    const form = useAppForm({
        defaultValues: {
            name: '',
            groupIds: [
                {
                    value: groups?.[0]?.id?.toString() || '',
                    label: groups?.[0]?.name || '',
                },
            ],
            teacherId: {
                value: teachers?.[0]?.id?.toString() || '',
                label: `${teachers?.[0]?.surname || ''} ${teachers?.[0]?.name || ''}`,
            },
            description: '',
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
            const { name, groupIds, teacherId, description, courseNumber } =
                value;
            const data = await createStudyPlan(
                { name, description, courseNumber },
                groupIds.map(group => Number(group.value)),
                parseInt(teacherId.value),
            );
            if (data) {
                mutate();
            }
            onClose();
        },
    });

    const error = groupsError || teachersError;
    const isLoading = isGroupsLoading || isTeachersLoading;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Создать учебный план"
                size="md"
            >
                {error ? (
                    <div>Ошибка загрузки данных</div>
                ) : isLoading ? (
                    <div>Загрузка...</div>
                ) : (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Название курса</span>
                                </label>
                                <form.AppField
                                    name="name"
                                    children={field => (
                                        <field.TextField
                                            placeholder="Введите название курса"
                                            className="input input-bordered w-full"
                                            onChange={e =>
                                                field.handleChange(
                                                    e.currentTarget.value,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Описание курса</span>
                                </label>
                                <form.AppField
                                    name="description"
                                    children={field => (
                                        <field.TextField
                                            placeholder="Кратко опишите цель и содержание курса"
                                            className="input input-bordered w-full"
                                            onChange={e =>
                                                field.handleChange(
                                                    e.currentTarget.value,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Номер курса</span>
                                </label>
                                <form.AppField
                                    name="courseNumber"
                                    children={field => (
                                        <field.TextField
                                            type="number"
                                            placeholder="Укажите номер (например, 1, 2, 3...)"
                                            className="input input-bordered w-full"
                                            onChange={e =>
                                                field.handleChange(
                                                    e.currentTarget.valueAsNumber,
                                                )
                                            }
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Группы</span>
                                </label>
                                <form.AppField
                                    name="groupIds"
                                    children={field => (
                                        <field.Select
                                            isMultiple
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            options={groups!.map(group => ({
                                                value: group.id.toString(),
                                                label: group.name,
                                            }))}
                                            className="w-full"
                                            placeholder="Выберите одну или несколько групп"
                                        />
                                    )}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Преподаватель</span>
                                </label>
                                <form.AppField
                                    name="teacherId"
                                    children={field => (
                                        <field.Select
                                            isMultiple={false}
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            options={teachers!.map(teacher => ({
                                                value: teacher.id.toString(),
                                                label: `${teacher.surname} ${teacher.name}`,
                                            }))}
                                            className="w-full"
                                            placeholder="Выберите преподавателя из списка"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <form.AppForm>
                            <form.SubmitButton className="btn btn-primary w-full mt-2">
                                Создать учебный план
                            </form.SubmitButton>
                        </form.AppForm>
                    </form>
                )}
            </Modal>
        </>
    );
}
