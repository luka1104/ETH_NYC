// Copyright © 2022 Planogy Inc. All rights reserved.

import Alamofire
import SwiftUI

class NFT: Decodable {
  var name: String
  var image_url: String?

  enum CodingKeys: String, CodingKey {
    case name
    case image_url
  }
}

struct ImportView: View {
  var address: String
  let headers: HTTPHeaders = ["Accept": "application/json"]
  let chains = ["Rinkeby", "Goerli", "Polygon", "Optimism"]
  @State private var chain = "Polygon"
  @State private var ens = ""
  @State private var nfts: [NFT] = []
  @State private var isShowingFrens = false

  var body: some View {
    VStack {
      NavigationLink(destination: FrensView(address: address, chain: chain), isActive: $isShowingFrens) {}
      Picker("Select a chain", selection: $chain) {
        ForEach(chains, id: \.self) {
          Text($0)
        }
      }
      Spacer()

      Button("ENS Name: \(ens)") {
        Task {
          do {
            let parameters = ["address": address, "chain": chain.lowercased()]
            ens = try await AF.request("https://eth-nyc.vercel.app/api/ens", method: .post, parameters: parameters, encoder: .json, headers: headers).serializingString().value
            debugPrint(ens)
          } catch {
            print("ERROR: ", error)
          }
        }
      }.padding(.vertical, 20)

      Button("Owned NFTs") {
        AF.request("https://testnets-api.opensea.io/api/v1/collections?asset_owner=" + address, method: .get, headers: headers).validate().responseDecodable(of: [NFT].self) { response in
          if let data = response.value {
            nfts = data
          }
        }
      }

      List(nfts, id: \.name) { nft in
        Text(nft.name)
        if let url = nft.image_url {
          Button(action: { uploadProfileImage(url) }) {
            AsyncImage(
              url: URL(string: url),
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
    .navigationBarTitle("Import")
    .navigationBarBackButtonHidden(true)
  }

  func uploadProfileImage(_ url: String) {
    let parameters = ["address": address, "image_uri": url, "chain": chain.lowercased()]
    AF.request("https://eth-nyc.vercel.app/api/storeimage", method: .post, parameters: parameters, encoder: .json, headers: headers).validate().responseDecodable(of: String.self) { response in
      print(response)
      isShowingFrens = true
    }
  }
}

struct ImportView_Previews: PreviewProvider {
  static var previews: some View {
    ImportView(address: "0x10")
  }
}
