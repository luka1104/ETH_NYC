// Copyright © 2022 Planogy Inc. All rights reserved.

import SwiftUI

struct ShakeEffect: GeometryEffect {
  func effectValue(size: CGSize) -> ProjectionTransform {
    ProjectionTransform(CGAffineTransform(translationX: -20 * sin(position * 2 * .pi), y: 0))
  }

  init(shakes: Int) {
    position = CGFloat(shakes)
  }

  var position: CGFloat
  var animatableData: CGFloat {
    get { position }
    set { position = newValue }
  }
}

extension View {
  func shakeEffect(_ shakes: Int) -> some View {
    modifier(ShakeEffect(shakes: shakes * 3))
  }
}
