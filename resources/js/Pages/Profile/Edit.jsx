import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { Image } from 'primereact/image';
import {Menu} from 'primereact/menu'
import { useState } from 'react';
import {Dialog} from 'primereact/dialog'
import {Accordion, AccordionTab} from 'primereact/accordion'
import UpdateInfoLaboral from './Partials/UpdateInfoLaboral';
import UpdateInfoAcademica from './Partials/UpdateInfoAcademica';
        

export default function Edit({ auth, mustVerifyEmail, status }) {

    const [updateInfoPersonal, setUpdateInfoPersonal] = useState(false)
    const [updateInfoLaboral, setUpdateInfoLaboral] = useState(false)
    const [updateInfoAcademica, setUpdateInfoAcademica] = useState(false)
    const [updatePassword, setUpdatePassword] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)

    let items = [
        {label: 'Actualizar Inf. personal', icon: 'pi pi-fw pi-pencil', command: () => {
            setUpdateInfoPersonal(true);
        }},
        {label: 'Actualizar contraseña', icon: 'pi pi-fw pi-key', command: () => {
            setUpdatePassword(true);
        }},
        {label: 'Actualizar Inf. Laboral', icon: 'pi pi-fw pi-briefcase', command: () => {
            setUpdateInfoLaboral(true);
        }},
        {label: 'Actualizar Inf. Academica', icon: 'pi pi-fw pi-building', command: () => {
            setUpdateInfoAcademica(true);
        }},
        {label: 'Eliminar Cuenta', icon: 'pi pi-fw pi-trash', command: () => {
            setDeleteAccount(true);
        }}
    ];
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil</h2>}
        >
            <Head title="Perfil" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg grid grid-cols-12">
                        <div className='col-span-2'>
                            <Image src="/assets/logo-senati.png" alt="Image" width="250" style={{verticalAlign: "middle", display: 'block'}}/>
                        </div>
                        <div className='ml-4 col-span-6 align-middle inline-block'>
                            <h1>{`${auth.user.name} ${auth.user.surname} (${auth.user.username})`}</h1>
                        </div>
                        <div className='col-span-3 align-middle inline-block'>
                            <Menu style={{width: "auto"}} model={items} />
                        </div>
                    </div>

                    <div className="grid grid-cols-12">
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg col-span-4">
                            <Accordion multiple activeIndex={[0, 1]}>
                                <AccordionTab header="Información Laboral">
                                    asd
                                </AccordionTab>
                                <AccordionTab header="Información Academica">
                                    asd
                                </AccordionTab>
                            </Accordion>
                        </div>
                        <div className="ml-6 p-4 sm:p-8 bg-white shadow sm:rounded-lg col-span-8">
                            Publicaciones
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Actualizar información Personal" visible={updateInfoPersonal} onHide={() => {setUpdateInfoPersonal(false)}}>
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                    className="max-w-xl"
                />
            </Dialog>
            <Dialog header="Actualizar información Personal" visible={updatePassword} onHide={() => setUpdatePassword(false)}>
                <UpdatePasswordForm className="max-w-xl" />
            </Dialog>
            <Dialog header="Actualizar información Personal" visible={deleteAccount} onHide={() => setDeleteAccount(false)}>
                <DeleteUserForm className="max-w-xl" />
            </Dialog>
            <Dialog header="Actualizar información Laboral" visible={updateInfoLaboral} onHide={() => setUpdateInfoLaboral(false)}>
                <UpdateInfoLaboral />
            </Dialog>
            <Dialog header="Actualizar información Academica" visible={updateInfoAcademica} onHide={() => setUpdateInfoAcademica(false)}>
                <UpdateInfoAcademica />
            </Dialog>
        </AuthenticatedLayout>
    );
}
