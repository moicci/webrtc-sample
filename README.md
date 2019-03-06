# WebRTC を手動で接続するサンプル

映像あり、音声なしのストリームを、片方向で転送するサンプルです。

## 操作手順

- [送信側](https://moicci.github.io/webrtc-sample/tx.html)を開く
- 表示された local SDP の中身をコピーする
- [受信側](https://moicci.github.io/webrtc-sample/rx.html)を開く
- 「Receive Offer from TX」の下にペーストし、「Receive Offer from TX」をクリックする
- Answer to TX の中身をコピーする
- 送信側の「Receive Answer from RX」の下にペーストし「Receive Answer from RX」をクリックする
- 受信側に映像が表示される。
