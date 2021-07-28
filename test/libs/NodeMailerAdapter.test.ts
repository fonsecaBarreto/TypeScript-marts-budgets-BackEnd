import exp from 'constants'
import NodeMailerAdapter from '../../src/libs/NodeMailerAdapter'
const sut = new NodeMailerAdapter("lucas.fonseca@moonstech.site", "4g5*T,snCRn")
describe("testing node miler", () =>{
    test("shoudl send a emal", async () =>{
        await sut.send("lucasfonsecab@hotmail.com","tete", "Ue, mais funciona msm?")
    })
})