// Copyright © 2022 Planogy Inc. All rights reserved.

import Alamofire
import FirebaseFirestore
import SwiftUI
import WalletConnectSwift

struct MainView: View {
  @AppStorage("sessionKey") private var session: Data = .init()
  @State private var walletConnect: WalletConnect!
  @State private var showingPopover = false
  @State private var wrongAttempts = 0
  @State private var isShowingImport = false
  private let db = Firestore.firestore()
  private var address: String? {
    if let session = try? JSONDecoder().decode(Session.self, from: session),
       let address = session.walletInfo?.accounts[0]
    {
      return address
    }
    return nil
  }

  var body: some View {
    NavigationView {
      VStack {
        NavigationLink(destination: ImportView(address: address ?? ""), isActive: $isShowingImport) {}
        VStack {
          Button(action: connect) {
            HStack {
              Image("WalletConnect").resizable().aspectRatio(contentMode: .fit).frame(width: 60)
              VStack {
                Text("Connect with WalletConnect")
                  .fontWeight(.semibold)
                  .font(.title)
                  .foregroundLinearGradient(
                    colors: [Color("WCBlue"), .purple],
                    startPoint: .leading,
                    endPoint: .trailing
                  )
                  .multilineTextAlignment(.leading)
              }
              .padding(.leading, 20)
            }
          }
          .padding(.horizontal, 30)
          .padding(.vertical, 20)
          .overlay(
            Capsule(style: .continuous)
              .stroke(Color("WCBlue"), lineWidth: 2)
          )
          Text("This will open MetaMask wallet")

        }
        .disabled(address != nil)
        .opacity(address == nil ? 1 : 0.2)

        if address != nil {
          Button("Disconnect") {
            session = .init()
          }
        }

        Button(action: verify) {
          HStack {
            Image("Worldcoin").resizable().aspectRatio(contentMode: .fit).frame(width: 60)
            VStack {
              Text("World ID")
                .fontWeight(.semibold)
                .font(.title)
                .foregroundLinearGradient(
                  colors: [.orange, .purple, .purple],
                  startPoint: .leading,
                  endPoint: .trailing
                )
                .multilineTextAlignment(.leading)
            }
            .padding(.leading, 20)
          }
        }
        .padding(.horizontal, 30)
        .padding(.vertical, 20)
        .overlay(
          Capsule(style: .continuous)
            .stroke(.purple, lineWidth: 2)
        )
        .shakeEffect(wrongAttempts)
        .animation(.linear, value: wrongAttempts)
        .padding(.top, 100)
      }
      .navigationBarTitle("Setup")
    }
    .onAppear {
      walletConnect = WalletConnect(delegate: self)
      walletConnect.reconnectIfNeeded()
      print("ON APPEAR: walletConnect")
    }
  }

  func connect() {
    let connectionUrl = walletConnect.connect()

    /// https://docs.walletconnect.org/mobile-linking#for-ios
    /// **NOTE**: Majority of wallets support universal links that you should normally use in production application
    /// Here deep link provided for integration with server test app only
    let deepLinkUrl = "wc://wc?uri=\(connectionUrl)"

    // Open MetaMask to get wallet address
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      if let url = URL(string: deepLinkUrl), UIApplication.shared.canOpenURL(url) {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
      }
    }
  }

  func verify() {
    if let address = address {
      db.collection("verifiedAddress").document(address).getDocument { document, _ in
        if let document = document, document.exists {
          let dataDescription = document.data().map(String.init(describing:)) ?? "nil"
          print("Document data: \(dataDescription)")
          isShowingImport = true
        } else {
          print("Document does not exist")
          wrongAttempts += 1
        }
      }
    }
  }
}

extension MainView: WalletConnectDelegate {
  func failedToConnect() {
    print("failedToConnect")
  }

  func didConnect() {
    print("didConnect")
  }

  func didDisconnect() {
    print("didDisconnect")
  }
}

struct MainView_Previews: PreviewProvider {
  static var previews: some View {
    MainView()
  }
}
