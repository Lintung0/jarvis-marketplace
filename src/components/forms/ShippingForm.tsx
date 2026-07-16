"use client";

interface ShippingAddress {
    full_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
}

interface Props {
    value: ShippingAddress;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const fields = [
      { name: "full_name",    label: "Nama Lengkap", colSpan: true  },
  { name: "phone",        label: "No. HP",       colSpan: false },
  { name: "address",      label: "Alamat",       colSpan: true  },
  { name: "city",         label: "Kota",         colSpan: false },
  { name: "state",        label: "Provinsi",     colSpan: false },
  { name: "postal_code",  label: "Kode Pos",     colSpan: false },
  { name: "country",      label: "Negara",       colSpan: false },
];

export default function ShippingForm({ value, onChange}: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Alamat Pengiriman
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className={field.colSpan ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={value[field.name as keyof ShippingAddress]}
              onChange={onChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        ))}
      </div>
    </div>
    );
}