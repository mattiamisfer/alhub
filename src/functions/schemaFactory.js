import * as Yup from 'yup';
export default (schema, loc = '') => {
    switch (schema) {
        case 'category':
            return (
                {

                    to: '/categories/' + loc,
                    imgLocation: 'category/',
                    data: [
                        { key: 'name', type: 'text', displayName: 'Name' },
                        { key: 'label', type: 'text', displayName: 'Label' },
                        { key: 'img', type: 'image', displayName: 'Image' },
                    ]

                }
            )
        case 'stores_full':
            return (
                [
                    {
                        to: '/stores/' + loc,
                        imgLocation: 'stores/',
                        data: [
                            { key: 'name', type: 'text', displayName: 'name', validation: Yup.string().required('Required') },
                            { key: 'location', type: 'text', displayName: 'Location', validation: Yup.string().required('Required') },
                            { key: 'category', type: 'select', displayName: 'category', values: '/categories/$1/name', validation: Yup.string().required('Required') },
                            { key: 'desciption', type: 'textarea', displayName: 'discription' },
                            { key: 'phone', type: 'text', displayName: 'phone' },
                            { key: 'stars', type: 'text', displayName: 'stars' },
                            {
                                key: 'coords', type: 'json', displayName: 'coordinates', notSub: true, data: [
                                    { key: 'latitude', type: 'text', displayName: 'latitude' },
                                    { key: 'longitude', type: 'text', displayName: 'longitude' },
                                ]
                            },
                            {
                                key: 'urls', type: 'json', displayName: 'Links', notSub: true, data: [
                                    { key: 'instagram', type: 'text', displayName: 'Instagram' },
                                    { key: 'dribbble', type: 'text', displayName: 'Website' },
                                ]
                            },
                            { key: 'img', type: 'image', displayName: 'Image' },
                            { key: 'bannerImg', type: 'image', displayName: 'Banner image' },

                        ]
                    },
                    {
                        to: '/store_details/' + loc,
                        imgLocation: 'stores/',
                        data: [
                            {
                                key: 'services', type: 'collection', displayName: 'Services', notSub: true, schema: [
                                    { key: 'name', type: 'text', displayName: 'Name' },
                                    { key: 'charge', type: 'text', displayName: 'Charge' },
                                    { key: 'image', type: 'image', displayName: 'Image' },

                                ]
                            },
                        ]

                    }

                ]
            )
        case 'stores':
            return (
                {
                    to: '/stores/' + loc,
                    imgLocation: 'stores/',
                    data: [
                        { key: 'name', type: 'text', displayName: 'name' },
                        { key: 'location', type: 'text', displayName: 'Location' },
                        { key: 'category', type: 'select', displayName: 'category', values: '/categories/$1/name' },
                        { key: 'desciption', type: 'textarea', displayName: 'discription' },
                        { key: 'img', type: 'image', displayName: 'Image' },
                        { key: 'phone', type: 'text', displayName: 'phone' },
                        { key: 'stars', type: 'text', displayName: 'stars' },
                        {
                            key: 'coords', type: 'json', displayName: 'coordinates', notSub: true, data: [
                                { key: 'latitude', type: 'text', displayName: 'latitude' },
                                { key: 'longitude', type: 'text', displayName: 'longitude' },
                            ]
                        },
                        {
                            key: 'urls', type: 'json', displayName: 'Links', notSub: true, data: [
                                { key: 'instagram', type: 'text', displayName: 'Instagram' },
                                { key: 'dribbble', type: 'text', displayName: 'Website' },
                            ]
                        }

                    ]
                }
            )
        case 'store_details':
            return (
                {
                    to: '/store_details/' + loc,
                    imgLocation: 'stores/',
                    data: [
                        { key: 'bannerImg', type: 'image', displayName: 'Banner image' },
                        {
                            key: 'services', type: 'collection', displayName: 'Services', notSub: true, schema: [
                                { key: 'name', type: 'text', displayName: 'Name' },
                                { key: 'charge', type: 'text', displayName: 'Charge' },
                                { key: 'img', type: 'image', displayName: 'Image' },

                            ]
                        },
                    ]

                }
            )
        case 'ads':
            return (
                {
                    to: '/ads/frontPage/RQJCOSIF4JF',
                    imgLocation: 'ads/frontPage/',
                    data: [
                        { key: 'img', type: 'image', displayName: '' },
                    ]
                }
            )
    }
}