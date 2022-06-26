// Copyright © 2022 Planogy Inc. All rights reserved.

import SwiftUI

public extension Text {
  func foregroundLinearGradient(colors: [Color], startPoint: UnitPoint, endPoint: UnitPoint) -> some View {
    overlay {
      LinearGradient(colors: colors, startPoint: startPoint, endPoint: endPoint)
        .mask(self)
    }
  }
}

public extension View {
  func onMainThread(_ closure: @escaping () -> Void) {
    if Thread.isMainThread {
      closure()
    } else {
      DispatchQueue.main.async {
        closure()
      }
    }
  }
}
