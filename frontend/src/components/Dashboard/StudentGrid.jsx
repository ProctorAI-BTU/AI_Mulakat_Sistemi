import React from "react";
import RiskBadge from "./RiskBadge";

export default function StudentGrid({ onNavigate }) {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ÖĞRENCİ</th>
            <th>SINAV</th>
            <th>RİSK</th>
            <th>DURUM</th>
            <th>İŞLEM</th>
          </tr>
        </thead>
        <tbody>
          <tr className="admin-row admin-row--normal">
            <td className="td-student">Ali Yılmaz</td>
            <td>Matematik Vize</td>
            <td><RiskBadge score="24" level="normal" /></td>
            <td>Normal</td>
            <td>
              <div className="action-buttons">
                <button className="action-btn action-btn--watch">👁 İzle</button>
                <button className="action-btn action-btn--report" onClick={() => onNavigate("report")}>📄 Rapor</button>
              </div>
            </td>
          </tr>
          <tr className="admin-row admin-row--high">
            <td className="td-student">Ayşe Demir</td>
            <td>Fizik Final</td>
            <td><RiskBadge score="78" level="high" /></td>
            <td>Yüksek Risk</td>
            <td>
              <div className="action-buttons">
                <button className="action-btn action-btn--watch">👁 İzle</button>
                <button className="action-btn action-btn--warn">⚠️ Uyar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}