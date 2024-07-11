module.exports = {
    extends: [
        'react-app',
        'react-app/jest',
    ],
    rules: {
        "no-restricted-globals": [
            "error",
            {
                "name": "event",
                "message": "Use local parameter instead."
            },
            {
                "name": "fdescribe",
                "message": "Do not use fdescribe."
            }
        ]
    }
};
