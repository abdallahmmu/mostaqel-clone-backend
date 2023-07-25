import * as Yup from 'yup'

export const AddProjectSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    range: Yup.number().required('Required').positive().integer('must be integer number').max(1000000, 'max project range is one million dollar'),
    duration: Yup.number().required('Required').positive().integer('must be integer number').max(100, 'max project duration is 100 days'),
    categoryId: Yup.string().required('Required'),
    skillsIds: Yup.array().min(1, 'Requied').required('Required'),
    // files:  Yup.array().nullable().test('fileSize', 'file size must not excced 1 MB', (value) => !value || value.size <=  1024 * 1024)
})