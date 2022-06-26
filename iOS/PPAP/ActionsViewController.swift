// Copyright © 2022 Planogy Inc. All rights reserved.

import UIKit
import WalletConnectSwift

/// For testing we recommend to use Rainbow Wallet
/// MetaMask does not support `eth_gasPrice` and `eth_getTransactionCount` at the moment of testing 01.09.2021
class ActionsViewController: UIViewController {
    weak var disconnectButton: UIButton!
    weak var personalSignButton: UIButton!
    weak var ethSignButton: UIButton!
    weak var ethSignTypedDataButton: UIButton!
    weak var ethSendTransactionButton: UIButton!
    weak var ethSignTransactionButton: UIButton!
    weak var ethSendRawTransactionButton: UIButton!
    weak var ethCustomRequestButton: UIButton!

    var client: Client!
    var session: Session!

    static func create(walletConnect: WalletConnect) -> ActionsViewController {
        let storyboard = UIStoryboard(name: "Main", bundle: Bundle.main)
        let controller = storyboard.instantiateViewController(withIdentifier: "ActionsViewController") as! ActionsViewController
        controller.client = walletConnect.client
        controller.session = walletConnect.session
        return controller
    }

    var walletAccount: String {
        return session.walletInfo!.accounts[0]
    }

    func disconnect(_ sender: Any) {
        guard let session = session else { return }
        try? client.disconnect(from: session)
    }

    // personal_sign should send a human readable message
    func personal_sign(_ sender: Any) {
        try? client.personal_sign(url: session.url, message: "Hi there!", account: session.walletInfo!.accounts[0]) {
            [weak self] response in
            self?.handleReponse(response, expecting: "Signature")
        }
    }

    // eth_sign should send a properly formed hash: keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))
    func eth_sign(_ sender: Any) {
        try? client.eth_sign(url: session.url, account: session.walletInfo!.accounts[0], message: "0x0123") {
            [weak self] response in
            self?.handleReponse(response, expecting: "Signature")
        }
    }

    func eth_signTypedData(_ sender: Any) {
        try? client.eth_signTypedData(url: session.url,
                                      account: session.walletInfo!.accounts[0],
                                      message: Stub.typedData) {
            [weak self] response in
            self?.handleReponse(response, expecting: "Signature") }
    }

    func eth_sendTransaction(_ sender: Any) {
        // example when we make 2 chained requests: 1) get nonce 2) sendTransaction
        // We recommend to use Rainbow Wallet to test this reques
        try? client.send(nonceRequest()) { [weak self] response in
            guard let self = self, let nonce = self.nonce(from: response) else { return }
            let transaction = Stub.transaction(from: self.walletAccount, nonce: nonce)
            try? self.client.eth_sendTransaction(url: response.url, transaction: transaction) { [weak self] response in
                self?.handleReponse(response, expecting: "Hash")
            }
        }
    }

    func eth_signTransaction(_ sender: Any) {
        let transaction = Stub.transaction(from: self.walletAccount, nonce: "0x0")
        try? self.client.eth_signTransaction(url: session.url, transaction: transaction) { [weak self] response in
            self?.handleReponse(response, expecting: "Signature")
        }
    }

    func eth_sendRawTransaction(_ sender: Any) {
        try? client.eth_sendRawTransaction(url: session.url, data: Stub.data) { [weak self] response in
            self?.handleReponse(response, expecting: "Hash")
        }
    }

    func customRequest(_ sender: Any) {
        // We recommend to use Rainbow Wallet to test this reques
        try? client.send(.eth_gasPrice(url: session.url)) { [weak self] response in
            self?.handleReponse(response, expecting: "Gas Price")
        }
    }

    func close(_ sender: Any) {
        for session in client.openSessions() {
            try? client.disconnect(from: session)
        }
        dismiss(animated: true)
    }

    private func handleReponse(_ response: Response, expecting: String) {
        DispatchQueue.main.async {
            if let error = response.error {
                self.show(UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert))
                return
            }
            do {
                let result = try response.result(as: String.self)
                self.show(UIAlertController(title: expecting, message: result, preferredStyle: .alert))
            } catch {
                self.show(UIAlertController(title: "Error",
                                       message: "Unexpected response type error: \(error)",
                                       preferredStyle: .alert))
            }
        }
    }

    private func show(_ alert: UIAlertController) {
        alert.addAction(UIAlertAction(title: "Close", style: .cancel))
        self.present(alert, animated: true)
    }

    private func nonceRequest() -> Request {
        return .eth_getTransactionCount(url: session.url, account: session.walletInfo!.accounts[0])
    }

    private func nonce(from response: Response) -> String? {
        return try? response.result(as: String.self)
    }
}

extension Request {
    static func eth_getTransactionCount(url: WCURL, account: String) -> Request {
        return try! Request(url: url, method: "eth_getTransactionCount", params: [account, "latest"])
    }

    static func eth_gasPrice(url: WCURL) -> Request {
        return Request(url: url, method: "eth_gasPrice")
    }
}

fileprivate enum Stub {
    /// https://docs.walletconnect.org/json-rpc-api-methods/ethereum#example-parameters
    static let typedData = """
{
    "types": {
        "EIP712Domain": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "version",
                "type": "string"
            },
            {
                "name": "chainId",
                "type": "uint256"
            },
            {
                "name": "verifyingContract",
                "type": "address"
            }
        ],
        "Person": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "wallet",
                "type": "address"
            }
        ],
        "Mail": [
            {
                "name": "from",
                "type": "Person"
            },
            {
                "name": "to",
                "type": "Person"
            },
            {
                "name": "contents",
                "type": "string"
            }
        ]
    },
    "primaryType": "Mail",
    "domain": {
        "name": "Ether Mail",
        "version": "1",
        "chainId": 1,
        "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
    },
    "message": {
        "from": {
            "name": "Cow",
            "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
        },
        "to": {
            "name": "Bob",
            "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
        },
        "contents": "Hello, Bob!"
    }
}
"""

    /// https://docs.walletconnect.org/json-rpc-api-methods/ethereum#example-parameters-1
    static func transaction(from address: String, nonce: String) -> Client.Transaction {
        return Client.Transaction(from: address,
                                  to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
                                  data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
                                  gas: "0x76c0", // 30400
                                  gasPrice: "0x9184e72a000", // 10000000000000
                                  value: "0x9184e72a", // 2441406250
                                  nonce: nonce,
                                  type: nil,
                                  accessList: nil,
                                  chainId: nil,
                                  maxPriorityFeePerGas: nil,
                                  maxFeePerGas: nil)
    }

    /// https://docs.walletconnect.org/json-rpc-api-methods/ethereum#example-5
    static let data = "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f07244567"

}
