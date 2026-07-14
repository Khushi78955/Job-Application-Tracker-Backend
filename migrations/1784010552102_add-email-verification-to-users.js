export const shorthands = undefined;

export const up = (pgm) => {
    pgm.addColumns("users", {
        email_verification_token: {
            type: "varchar(255)"
        },
        email_verification_expires_at: {
            type: "timestamp"
        }
    })
}

export const down = (pgm) => {
    pgm.dropColumns("users", [
        "email_verification_token",
        "email_verification_expires_at"
    ])
}