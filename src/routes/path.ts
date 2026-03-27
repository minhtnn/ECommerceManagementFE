import { de } from "date-fns/locale";

const path = (root: string, sublink: string) => {
    return `${root || ''}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_SYSTEM_ADMIN_DASHBOARD = '/system-admin/dashboard';
const ROOTS_BRAND_ADMIN_DASHBOARD = '/brand-admin/dashboard';
const ROOTS_GUEST = '';
const ROOTS_END_CUSTOMER = '/end-customer';

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    account: path(ROOTS_AUTH, '/account'),
    logout: path(ROOTS_AUTH, '/logout'),
    forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_SYSTEM_ADMIN_DASHBOARD = {
    root: ROOTS_SYSTEM_ADMIN_DASHBOARD,
    general: {
        app: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/general'),
        account: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/account'),
    },
    brand: {
        root: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/brands'),
        create: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/brands/create'),
        edit: (id: string) => path(ROOTS_SYSTEM_ADMIN_DASHBOARD, `/brands/${id}/edit`),
    },
    paymentMethod: {
        root: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/payment-methods'),
        create: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/payment-methods/create'),
        edit: (id: string) => path(ROOTS_SYSTEM_ADMIN_DASHBOARD, `/payment-methods/${id}/edit`),
    },
    systemConfigurations:{
        root: path(ROOTS_SYSTEM_ADMIN_DASHBOARD, '/system-configurations'),
    }
}

export const PATH_BRAND_DASHBOARD = {
    root: ROOTS_BRAND_ADMIN_DASHBOARD,
    general: {
        app: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/general'),
        account: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/account'),
    },
    productCategory: {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/product-categories'),
        create: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/product-categories/create'),
        edit: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/product-categories/${id}/edit`),
    },
    product: {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/products'),
        create: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/products/create'),
        edit: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/products/${id}/edit`),
    },
    customer: {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/customers'),
        detail: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/customers/${id}/view`),
    },
    order: {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/orders'),
        detail: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/orders/${id}/view`),
    },
    paymentMethod: {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/payment-methods'),
        create: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/payment-methods/create'),
        edit: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/payment-methods/${id}/edit`),
    },
    promotionRule: {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/promotion-rules'),
        create: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/promotion-rules/create'),
        edit: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/promotion-rules/${id}/edit`),
    },
    posts : {
        root: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/posts'),
        create: path(ROOTS_BRAND_ADMIN_DASHBOARD, '/posts/create'),
        edit: (id: string) => path(ROOTS_BRAND_ADMIN_DASHBOARD, `/posts/${id}/edit`),
    }
}

export const PATH_GUEST = {
    root: ROOTS_GUEST,
    home: {
        root: path(ROOTS_GUEST, '/home'),
    },
    products: {
        root: path(ROOTS_GUEST, '/products'),
        detail: (id: string) => path(ROOTS_GUEST, `/products/${id}`),
    },
    introduce: {
        root: path(ROOTS_GUEST, '/introduce'),
    },
    news: {
        root: path(ROOTS_GUEST, '/news'),
        detail: (id: string) => path(ROOTS_GUEST, `/news/${id}`),
    },
    contact: {
        root: path(ROOTS_GUEST, '/contact'),
    },
}

export const PATH_END_CUSTOMER = {
    root: ROOTS_END_CUSTOMER,
    cart: path(ROOTS_END_CUSTOMER, '/cart'),
    checkout: path(ROOTS_END_CUSTOMER, '/checkout'),
    orders: {
        root: path(ROOTS_END_CUSTOMER, '/orders'),
        view: (id: string) => path(ROOTS_END_CUSTOMER, `/orders/${id}/view`)
    },
    payment: (id: string) => path(ROOTS_END_CUSTOMER, `/payment/${id}`),
    addresses: path(ROOTS_END_CUSTOMER, '/addresses'),
    changePassword: path(ROOTS_END_CUSTOMER, '/change-password')
}