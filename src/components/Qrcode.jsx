import React from "react";
import QRCode from 'qrcode'
import { useEffect, useState } from 'react';

const Qrcode = ({ text }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(text).then((data) => {
      setSrc(data);
    })
  }, [])

  return <div>
    <img src={src} />
  </div>
}

export default Qrcode;