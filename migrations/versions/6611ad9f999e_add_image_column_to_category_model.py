"""Add image column to Category model

Revision ID: 6611ad9f999e
Revises: 9fdce2d65bc7
Create Date: 2024-04-30 16:18:58.703736

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6611ad9f999e'
down_revision = '9fdce2d65bc7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('category', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('category', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)

    # ### end Alembic commands ###
