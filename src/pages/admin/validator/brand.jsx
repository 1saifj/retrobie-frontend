import * as Yup from 'yup';
import {MAX, MIN, REQUIRED} from './messages';

export function newBrand() {
    return Yup.object().shape({
        name: Yup.string()
            .min(3, MIN(3))
            .required(REQUIRED),
        copy: Yup.string()
            .min(80, MIN(80))
            .max(180, MAX(180))
            .required(REQUIRED),
        short: Yup.string()
            .max(80, MAX(80))
            .required(REQUIRED),
        long: Yup.string()
            .min(120, MIN(120))
            .required(REQUIRED),
        featuredImage: Yup.object().required(REQUIRED),
        logo: Yup.object().required(REQUIRED),
        uuid: Yup.string().required(REQUIRED)
    })
}
