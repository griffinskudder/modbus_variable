import {
    ModbusIntegerVariable,
    ModbusBooleanVariable,
    ModbusByteVariable,
    ModbusDoubleVariable,
    IModbusClient
} from "./index";

class ModbusClient implements IModbusClient {
    readHoldingRegisters = jest.fn((holdingRegister: number, count: number) => {
        return [Number()];
    });
    writeHoldingRegisters = jest.fn((holdingRegister: number, data: number[]) => {
        return;
    });
}


const client = new ModbusClient();
const buffer = new ArrayBuffer(8);
const registerData = new DataView(buffer);

const booleanData = {holdingRegister: 1, bitIndex: 1};

const boolVar = new ModbusBooleanVariable(
    "Test Boolean",
    booleanData.holdingRegister,
    registerData,
    client,
    booleanData.bitIndex
);

test("ModbusBooleanVariable setter", () => {
    boolVar.value = true;
    expect(boolVar.value).toBe(true);
    expect(client.writeHoldingRegisters.mock.calls).toHaveLength(1);
    expect(client.writeHoldingRegisters.mock.calls[0][1]).toStrictEqual([Number.parseInt('0100000000000000', 2)])
});

test("ModbusBooleanVariable getter", () => {
    expect(boolVar.value).toBe(true);
});

