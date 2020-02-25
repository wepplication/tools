var combiningText = [
	0x0300, 0x0301, 0x0302, 0x0303, 0x0304, 0x0305, 0x0306, 0x0307, 0x0308, 0x0309, 0x030A, 0x030B, 0x030C, 0x030D, 0x030E, 0x030F,
	0x0310, 0x0311, 0x0312, 0x0313, 0x0314, 0x0315, 0x0316, 0x0317, 0x0318, 0x0319, 0x031A, 0x031B, 0x031C, 0x031D, 0x031E, 0x031F,
	0x0320, 0x0321, 0x0322, 0x0323, 0x0324, 0x0325, 0x0326, 0x0327, 0x0328, 0x0329, 0x032A, 0x032B, 0x032C, 0x032D, 0x032E, 0x032F,
	0x0330, 0x0331, 0x0332, 0x0333, 0x0334, 0x0335, 0x0336, 0x0337, 0x0338, 0x0339, 0x033A, 0x033B, 0x033C, 0x033D, 0x033E, 0x033F,
	0x0340, 0x0341, 0x0342, 0x0343, 0x0344, 0x0345, 0x0346, 0x0347, 0x0348, 0x0349, 0x034A, 0x034B, 0x034C, 0x034D, 0x034E, 0x034F,
	0x0350, 0x0351, 0x0352, 0x0353, 0x0354, 0x0355, 0x0356, 0x0357, 0x0358, 0x0359, 0x035A, 0x035B, 0x035C, 0x035D, 0x035E, 0x035F,
	0x0360, 0x0361, 0x0362, 0x0363, 0x0364, 0x0365, 0x0366, 0x0367, 0x0368, 0x0369, 0x036A, 0x036B, 0x036C, 0x036D, 0x036E, 0x036F,
	0x1AB0, 0x1AB1, 0x1AB2, 0x1AB3, 0x1AB4, 0x1AB5, 0x1AB6, 0x1AB7, 0x1AB8, 0x1AB9, 0x1ABA, 0x1ABB, 0x1ABC, 0x1ABD, 0x1ABE,
	0x1DC0, 0x1DC1, 0x1DC2, 0x1DC3, 0x1DC4, 0x1DC5, 0x1DC6, 0x1DC7, 0x1DC8, 0x1DC9, 0x1DCA, 0x1DCB, 0x1DCC, 0x1DCD, 0x1DCE, 0x1DCF,
	0x1DD0, 0x1DD1, 0x1DD2, 0x1DD3, 0x1DD4, 0x1DD5, 0x1DD6, 0x1DD7, 0x1DD8, 0x1DD9, 0x1DDA, 0x1DDB, 0x1DDC, 0x1DDD, 0x1DDE, 0x1DDF,
	0x1DE0, 0x1DE1, 0x1DE2, 0x1DE3, 0x1DE4, 0x1DE5, 0x1DE6, 0x1DE7, 0x1DE8, 0x1DE9, 0x1DEA, 0x1DEB, 0x1DEC, 0x1DED, 0x1DEE, 0x1DEF,
	0x1DF0, 0x1DF1, 0x1DF2, 0x1DF3, 0x1DF4, 0x1DF5, 0x1DF6, 0x1DF7, 0x1DF8, 0x1DF9,         0x1DFB, 0x1DFC, 0x1DFD, 0x1DFE, 0x1DFF,
	0x20D0, 0x20D1, 0x20D2, 0x20D3, 0x20D4, 0x20D5, 0x20D6, 0x20D7, 0x20D8, 0x20D9, 0x20DA, 0x20DB, 0x20DC, 0x20DD, 0x20DE, 0x20DF,
	0x20E0, 0x20E1, 0x20E2, 0x20E3, 0x20E4, 0x20E5, 0x20E6, 0x20E7, 0x20E8, 0x20E9, 0x20EA, 0x20EB, 0x20EC, 0x20ED, 0x20EE, 0x20EF,
	0x20F0,
	0xFE20, 0xFE21, 0xFE22, 0xFE23, 0xFE24, 0xFE25, 0xFE26, 0xFE27, 0xFE28, 0xFE29, 0xFE2A, 0xFE2B, 0xFE2C, 0xFE2D, 0xFE2E, 0xFE2F,
	0x0F89,
	[0x0306, 0x0308], [0x0306, 0x030E], [0xA67C, 0x0308], [0x0310, 0x0308], [0x0310, 0x030E], [0x0304, 0x0308], [0x0304, 0x030E], [0x030A, 0x0308], [0x030A, 0x030E], [0x0311, 0x0308], [0x0311, 0x030E], [0x0324, 0x032E], [0x0348, 0x032E], [0x0324, 0x0325], [0x0348, 0x0325], [0x0324, 0x033B], [0x0348, 0x033B], [0x0324, 0x032B], [0x0348, 0x032B], [0x0324, 0x032F], [0x0348, 0x032F], [0x0324, 0x0331], [0x0348, 0x0331], 
	[0x0324, 0x032B, 0x035A], [0x0348, 0x032B, 0x035A]
];