import { DataTypes } from "sequelize";
import { Mysql } from "../Connections/mysql";

const sequelize = Mysql.getConnection();

export const AutomatedCertificates = sequelize.define('AutomatedCertificates', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    domainName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    brandId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    certificateHash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    challengeFilePath: {
        type: DataTypes.STRING,
    },
    certificateKeyPath: {
        type: DataTypes.STRING,
    },
    certificateCrtPath: {
        type: DataTypes.STRING,
    },
    certificateCaBundlePath: {
        type: DataTypes.STRING,
    },
    csrMeta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.DATE
    },
    autoRenewedOn: {
        type: DataTypes.DATE
    },
    issuer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    domainType: {
        type: DataTypes.ENUM,
        values: ['internal', 'external']
    },
    retryAttempt: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: "automated_certificates",
    createdAt: true,
    updatedAt: true,
    indexes: [{
        name: 'expiryDate_idx',
        using: 'BTREE',
        fields: ['expiryDate']
    }]
});
// AutomatedCertificates.sync({ alter: true });