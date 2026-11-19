// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Registro de autenticidade de produtos por lote
/// @notice Guarda apenas o hash dos dados do produto, nunca os dados em si.
///         Quem tem o produto recalcula o hash e confere com `verify`.
contract ProductCertificate {
    struct Certificate {
        bytes32 dataHash;
        uint64 issuedAt;
        bool revoked;
    }

    address public immutable owner;
    mapping(bytes32 => Certificate) private certificates;

    error NotOwner();
    error EmptyHash();
    error AlreadyIssued(bytes32 id);
    error NotFound(bytes32 id);

    event CertificateIssued(bytes32 indexed id, bytes32 dataHash);
    event CertificateRevoked(bytes32 indexed id);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @param id identificador do lote, ex.: keccak256("asad-100ml|L1")
    /// @param dataHash hash dos dados do produto naquele lote
    function issue(bytes32 id, bytes32 dataHash) external onlyOwner {
        if (dataHash == bytes32(0)) revert EmptyHash();
        if (certificates[id].issuedAt != 0) revert AlreadyIssued(id);
        certificates[id] = Certificate(dataHash, uint64(block.timestamp), false);
        emit CertificateIssued(id, dataHash);
    }

    function revoke(bytes32 id) external onlyOwner {
        if (certificates[id].issuedAt == 0) revert NotFound(id);
        certificates[id].revoked = true;
        emit CertificateRevoked(id);
    }

    function verify(bytes32 id, bytes32 dataHash)
        external
        view
        returns (bool exists, bool matches, bool revoked, uint64 issuedAt)
    {
        Certificate storage c = certificates[id];
        return (c.issuedAt != 0, c.dataHash == dataHash, c.revoked, c.issuedAt);
    }
}
