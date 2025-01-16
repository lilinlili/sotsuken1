// カメラの位置を更新（プレイヤーと一緒に動くように）
function updateCamera() {
    // カメラはプレイヤーの進行方向と逆の位置に配置
    const offset = new THREE.Vector3(0, 2, 5); // カメラのオフセット
    // プレイヤーの進行方向に基づきオフセットを調整
    if (moveForward || moveBackward) {
        // プレイヤーが前進中または後退中の場合、カメラは進行方向の逆に
        offset.set(0, 2, -5); // 逆方向にカメラを配置
    } else if (moveLeft || moveRight) {
        // 左右移動している場合もカメラを横に調整
        offset.set(-5, 2, 0); // 左または右にカメラを配置
    }

    // プレイヤーの位置とオフセットに基づきカメラの位置を更新
    camera.position.copy(player.position).add(offset);
    camera.lookAt(player.position); // プレイヤーを常に見る
}
