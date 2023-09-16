import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { WorkspaceService } from '@/Services/WorkspaceService';
import { EnterpriseService } from '@/Services/EnterpriseService';
import { Dropdown } from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar'
import {Checkbox} from 'primereact/checkbox'
import { UserService } from '@/Services/UserService';
import { usePage } from '@inertiajs/react';
import moment from 'moment/moment';
import { CollegeService } from '@/Services/CollegeService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const UpdateInfoAcademica = ({setColleges}) => {
    const user = usePage().props.auth.user;
    
    const refresh = () => {
        UserService.getCollegesInfo(user.id).then((res)=>{
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
            console.log
            setColleges(entries);
            setProducts(entries)
        })
    }

    useState(()=>{
        refresh();
    }, [])

    let emptyProduct = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK',
        enterprise: '',
        checked: true,
        role: '',
        start: new Date(),
        end: new Date()
    };

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [enterprises, setEnterprises] = useState([]);

    /*useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data));
    }, []);*/

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = async () => {
        let enterprises = await CollegeService.getColleges();
        setEnterprises(enterprises.map((item)=>{
            return {
                value: item.id,
                name: item.name
            }
        }))
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (true) {
            let _product = { ...product };
            if (product.id) {
                UserService.addEnterprisesToUser({
                    enterprise: product.enterprise,
                    role: product.role,
                    start_date: product.start,
                    continue: product.checked,
                    end_date:product.end,
                    user: user.id
                })
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                await UserService.addCollegesToUser({
                    college: product.enterprise,
                    course: product.role,
                    start_date: moment(product.start).format("YYYY-MM-DD"),
                    continue: product.checked,
                    end_date:product.checked?null:moment(product.end).format("YYYY-MM-DD"),
                    user: user.id
                })
                toast.current?.show({
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Información laboral añadida',
                    life: 3000
                });
            }
            setProductDialog(false);
            setProduct(emptyProduct);
            refresh();
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        UserService.removeEnterprisesInfo(user.id, {pivot: product.pivot_id})
        refresh();
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < (products)?.length; i++) {
            if ((products)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products)?.filter((val) => !(selectedProducts)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                {/**<Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista de Información Academica</h5>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        loading={loading}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando desde {first} a {last} de {totalRecords} registros laborales"
                        emptyMessage="No se encontraron registros laborales."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="enterprise" header="Escuela" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="role" header="Carrera/Curso" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="start_date" header="Fecha de inicio" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="end_date" header="Fecha de fin" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalles Información Laboral" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Escuela</label>
                            <Dropdown filter value={product.enterprise} onChange={(e) => {
                                let _product = {...product};
                                _product.enterprise = e.value;
                                setProduct(_product)
                            }} options={enterprises} optionLabel="name" 
                        placeholder="Elige una Escuela" className="w-full md:w-14rem" />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field col">
                                <label htmlFor="quantity">Carrera / Curso</label>
                                <InputText id="quantity" value={product.role} onChange={(e) => onInputChange(e, 'role')} />
                        </div>
                        <div className="field col">
                                <label htmlFor="quantity">Fecha de entrada</label>
                                <Calendar showIcon showButtonBar value={product.start} view="month" dateFormat="mm/yy" onChange={(e) => {
                                    setProduct({...product, start: e.value})
                                }} />
                        </div>
                        <div className="field col mt-2 mb-2">
                                <Checkbox inputId="ingredient1" name="pizza" value="Cheese" onChange={(e)=>{
                                    setProduct({...product, checked: e.checked})
                                }} checked={product.checked} />
                                <label htmlFor="quantity" className='ml-2'>¿Continuas estudiando?</label>
                                
                        </div>
                        {
                            product.checked?null:<div className="field col">
                            <label htmlFor="quantity">Fecha de salida</label>
                            <Calendar showIcon showButtonBar value={product.end} view="month" dateFormat="mm/yy" onChange={(e) => {
                                setProduct({...product, end: e.value})
                            }} />
                    </div>
                        }
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    ¿Estas seguro que deseas eliminar tu historial en <b>{product.enterprise}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UpdateInfoAcademica;