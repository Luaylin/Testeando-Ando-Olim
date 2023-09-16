import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, useForm } from '@inertiajs/react';
import { Image } from 'primereact/image';
import {Menu} from 'primereact/menu'
import { useEffect, useRef, useState } from 'react';
import {Dialog} from 'primereact/dialog'
import {Accordion, AccordionTab} from 'primereact/accordion'
import UpdateInfoLaboral from './Partials/UpdateInfoLaboral';
import UpdateInfoAcademica from './Partials/UpdateInfoAcademica';
import { Button } from 'primereact/button';
import { CityService } from '@/Services/CityService';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import {Tag } from 'primereact/tag'
import axios from 'axios';
import { UserService } from '@/Services/UserService';
import { InputTextarea } from 'primereact/inputtextarea';
import moment from 'moment';
import { Checkbox } from 'primereact/checkbox';
import { PostService } from '@/Services/PostService';
        

export default function Edit({ auth, mustVerifyEmail, status }) {
    const [updateInfoPersonal, setUpdateInfoPersonal] = useState(false)
    const [updateInfoLaboral, setUpdateInfoLaboral] = useState(false)
    const [updateInfoAcademica, setUpdateInfoAcademica] = useState(false)
    const [updatePassword, setUpdatePassword] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)
    const [updatePerfilPhoto, setUpdatePerfilPhoto] = useState(false);
    const [currentCity, setCurrentCity] = useState('');
    const [enterprises, setEnterprises] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [createPost, setCreatePost] = useState(false)
    const fileUploadRef = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const [listpost, setListposts] = useState([])
    const { data, setData, post, progress } = useForm({
        user: auth.user.id,
        content: null,
        hasVideo: false,
        video: null,
        hasProfilePhoto: false,
        photo: null
    })

    function submit(e) {
        
      }

    const getEnterprisesInfo = () => {
        UserService.getEnterprisesInfo(auth.user.id).then((res)=>{
            let user = res.user;
            let pivot = res.pivot;
            let enterprise = res.enterprise;
            let entries = pivot.map(x=>{
                return {
                    enterprise: enterprise.find((item)=>item.id === x.enterprise_id).name,
                    role: x.role,
                    start_date: moment(x.start_date).format("YYYY-MM"),
                    end_date: x.continue===1? "ACTUALMENTE" : moment(x.end_date).format("YYYY-MM"),
                    pivot_id: x.id
                }
            });
            setEnterprises(entries)
        })
    }

    const getCollegesInfo = () => {
        UserService.getCollegesInfo(auth.user.id).then((res)=>{
            let user = res.user;
            let pivot = res.pivot;
            let enterprise = res.colleges;
            let entries = pivot.map(x=>{
                return {
                    enterprise: enterprise.find((item)=>item.id === x.college_id).name,
                    role: x.course,
                    start_date: moment(x.start_date).format("YYYY-MM"),
                    end_date: x.continue===1? "ACTUALMENTE" : moment(x.end_date).format("YYYY-MM"),
                    pivot_id: x.id
                }
            });
            setColleges(entries)
        })
    }

    const getPosts = () => {
        PostService.getPosts(auth.user.id).then((x=>{
            setListposts(x)
        }))
    }

    const newPostFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={()=>{
                setData('hasProfilePhoto', false);
                setCreatePost(false)
            }} />
            <Button label="Crear" icon="pi pi-check" text onClick={()=>{
                console.log("sending")
                post('/api/users')
            }}/>
        </>
    );

    useEffect(()=>{
        getEnterprisesInfo();
        getCollegesInfo();
        getPosts();
    }, [])

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        let form = new FormData()
        form.append("profile_img", e.files[0]);
        axios.put(`api/userphoto/${auth.user.id}`, form);
        
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const uploadhandler = (e) => {
        let form = new FormData()
        form.append("profile_img", e.files[0]);
        axios.put(`api/userphoto/${auth.user.id}`, form);
        
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                    </span>
                </div>
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <center><i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i></center>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    useEffect(()=> {
        CityService.getCity(auth.user.city_id).then((res)=>{
            setCurrentCity(res.name);
        })
    }, [])

    let items = [
        {label: 'Actualizar Inf. personal', icon: 'pi pi-fw pi-pencil', command: () => {
            setUpdateInfoPersonal(true);
        }},
        {label: 'Actualizar Foto de Perfil', icon: 'pi pi-fw pi-user', command: () => {
            setData('hasProfilePhoto', true);
            setUpdatePerfilPhoto(true);
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
                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg grid grid-cols-12 flex items-center">
                    <div className="col-span-12 md:col-span-2 md:flex md:flex-col md:items-center">
                        <Image src={auth.user.profile_img??"/assets/user.png"} alt="Image" width="250" className="w-full" style={{ verticalAlign: "middle", display: 'block' }} preview />
                    </div>
                    <div className="ml-4 col-span-12 md:col-span-7 md:items-center">
                        <h1 className="text-2xl">{`${auth.user.name} ${auth.user.surname}`}</h1>
                        <h1>{`(${auth.user.username})`}</h1>
                        <h1>{`${currentCity}`}</h1>
                    </div>
                    <div className="col-span-12 md:col-span-3">
                        <Menu style={{ width: "auto" }} model={items} />
                    </div>
                </div>

                    <div className="grid grid-cols-12">
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg col-span-4 md:col-span-2">
                            <Accordion multiple activeIndex={[1, 2]}>
                                <AccordionTab header="Amigos">
                                    asd
                                </AccordionTab>
                                <AccordionTab header="Información Laboral">
                                <hr/>
                                    {enterprises.map((item)=>{
                                        return <>
                                            <div>
                                                {item.enterprise} - {item.role}
                                            </div>
                                            <div>
                                                {item.start_date} - {item.end_date}
                                            </div>
                                            <hr/>
                                        </>
                                    })}
                                </AccordionTab>
                                <AccordionTab header="Información Academica">
                                <hr/>
                                    {colleges.map((item)=>{
                                        return <>
                                            <div>
                                                {item.enterprise} - {item.role}
                                            </div>
                                            <div>
                                                {item.start_date} - {item.end_date}
                                            </div>
                                            <hr/>
                                        </>
                                    })}
                                </AccordionTab>
                            </Accordion>
                        </div>
                        <div className="ml-6 p-4 sm:p-8 bg-white shadow sm:rounded-lg col-span-8">
                            <h1>Publicaciones</h1>
                            <center><Button icon="pi pi-plus" label="Crear publicación" onClick={()=>{setCreatePost(true)}}/></center>
                            <hr/>
                            {listpost.map(x=>{
                                return <><div>
                                {x.content}
                                </div>
                                <hr/>
                                </>
                            })}
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
                <UpdateInfoLaboral setEnterprisesalt={setEnterprises}/>
            </Dialog>
            <Dialog header="Actualizar información Academica" visible={updateInfoAcademica} onHide={() => setUpdateInfoAcademica(false)}>
                <UpdateInfoAcademica setColleges={setColleges}/>
            </Dialog>
            <Dialog header="Actualizar foto de perfil" visible={updatePerfilPhoto} onHide={() => {setData('hasProfilePhoto', false);setUpdatePerfilPhoto(false)}} footer={newPostFooter}>
                <input type='file' onChange={e=>setData('photo', e.target.files[0])}/>
            </Dialog>
            <Dialog header="Crear Post" style={{ width: '35vw' }} visible={createPost} onHide={() => setCreatePost(false)} footer={newPostFooter}>
                Escribe tu post aqui para publicarlo:
                <InputTextarea value={data.content} onChange={(e) => setData("content", e.target.value)} rows={5} className='w-full'/>
                <div className="flex align-items-center">
                    <Checkbox inputId="ingredient1" name="pizza" value="Cheese" onChange={(e)=>{
                        setData("hasVideo", e.checked)
                    }} checked={data.hasVideo} />
                    <label htmlFor="ingredient1" className="ml-2">¿Incluir Video?</label>
                </div>
                {
                        data.hasVideo?<input type="file" onChange={e => {
                            setData('video', e.target.files[0])
                        }}></input>: null
                    }
            </Dialog>
        </AuthenticatedLayout>
    );
}
