// Copyright © 2022 Planogy Inc. All rights reserved.

import Alamofire
import SwiftUI
import WalletConnectSwift

class Fren: Decodable {
  var id = UUID()
  var name: String
  var holder: String
  var pocWith: String
  var timestamp: Int64
  var ensName: String?
  var imageUri: String?
  var chain: String?

  enum CodingKeys: String, CodingKey {
    case name
    case holder
    case pocWith
    case timestamp
    case ensName
    case imageUri
    case chain
  }
}

class Info: Decodable {
  var ensName: String
  var imageUri: String
  var chain: String

  enum CodingKeys: String, CodingKey {
    case ensName
    case imageUri
    case chain
  }
}

struct FrensView: View {
  // Detect swipe up to add a friend
  // Call mint function
  // Loading for transaction and send EPNS
  // Show list of Frens
  var address: String
  var chain: String
  let headers: HTTPHeaders = ["Accept": "application/json"]
  @State private var offset = CGSize.zero
  @State private var offsetDirection = 1
  @State private var showingPopover = false
  @State private var frens: [Fren] = []

  var body: some View {
    ZStack {
      Text("Swipe up to add a friend").padding(.top, 200)

      VStack {
        Spacer()
        Button("Show All My Frens") {
          showingPopover = true
          getAllMetadata()
        }
      }

      VStack {
        Text("Add a Fren")
          .fontWeight(.semibold)
          .font(.title)
          .foregroundLinearGradient(
            colors: [.red, .purple, Color("WCBlue"), .yellow],
            startPoint: .leading,
            endPoint: .trailing
          )
      }
      .padding(.horizontal, 30)
      .padding(.vertical, 30)
      .background(Color.white)
      .overlay(
        Capsule(style: .continuous)
          .stroke(.purple, lineWidth: 2)
      )
      .offset(x: 0, y: offset.height)
      .opacity(1.3 - Double(abs(offset.height / 220)))
      .gesture(DragGesture()
        .onChanged { gesture in
          offset = gesture.translation
        }
        .onEnded { _ in
          if offset.height < -250 {
            addFren()
          } else {
            offset = .zero
          }
        }
      )
      .animation(.spring(), value: offset.height)
    }
    .navigationBarTitle("Frens")
    .navigationBarTitleDisplayMode(.large)
    .popover(isPresented: $showingPopover) {
      List {
        ForEach(frens, id: \.id) { fren in
          Button(action: { getInfo(fren.pocWith) }) {
            Text(fren.pocWith)
          }
          if let ens = fren.ensName {
            Text("ENS: \(ens)")
          }
          if let url = fren.imageUri {
            AsyncImage(url: URL(string: url),
              content: { image in
                image.resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(maxWidth: 120, maxHeight: 120)
              },
              placeholder: {
                ProgressView()
              })
          }
        }
      }
    }
  }

  func addFren() {
    let parameters = ["address": address, "chain": chain.lowercased()]
    AF.request("https://eth-nyc.vercel.app/api/detect", method: .post, parameters: parameters, encoder: .json, headers: headers).validate().responseDecodable(of: String.self) { response in
      print(response)

      offset = .zero
    }
  }

  func getAllMetadata() {
    let parameters = ["address": address, "chain": chain.lowercased()]
    AF.request("https://eth-nyc.vercel.app/api/metadata", method: .post, parameters: parameters, encoder: .json, headers: headers).validate().responseDecodable(of: [Fren].self) { response in
      print(response)
      if let data = response.value {
        frens = data
      }
    }
  }

  func getInfo(_ poc: String) {
    print("Get info \(poc)")
    let parameters = ["address": poc]
    AF.request("https://eth-nyc.vercel.app/api/getInfo", method: .post, parameters: parameters, encoder: .json, headers: headers).validate().responseDecodable(of: Info.self) { response in
      print(response)
      if let info = response.value {
        for fren in frens {
          if fren.pocWith == poc {
            print("FOUND FREN \(info.ensName)")
            fren.ensName = info.ensName
            fren.imageUri = info.imageUri
            fren.chain = info.chain
          }
        }
      }

      frens.append(frens[0])
    }
  }
}

struct FrensView_Previews: PreviewProvider {
  static var previews: some View {
    FrensView(address: "0x01", chain: "Polygon")
  }
}
